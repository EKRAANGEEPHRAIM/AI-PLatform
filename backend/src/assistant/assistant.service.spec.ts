import { ServiceUnavailableException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { AssistantService } from './assistant.service';

/** Sans vraie pause entre les tentatives */
class TestAssistantService extends AssistantService {
  protected override wait(): Promise<void> {
    return Promise.resolve();
  }
}

const profile = {
  name: 'Boutique Adjoua',
  knowledgeBase: 'Fermé le dimanche.',
  contactInfo: 'WhatsApp',
};
const history = [{ role: 'user' as const, content: 'Ouvert dimanche ?' }];

function build(env: Record<string, string> = { AI_API_KEY: 'cle-test' }) {
  return new TestAssistantService(new ConfigService(env));
}

const reply = (content: string) =>
  new Response(
    JSON.stringify({ choices: [{ message: { role: 'assistant', content } }] }),
    { status: 200 },
  );
const failure = (status: number) =>
  new Response('{"error":"busy"}', { status });

describe('AssistantService', () => {
  let fetchMock: jest.SpyInstance;

  beforeEach(() => {
    fetchMock = jest.spyOn(globalThis, 'fetch');
  });

  afterEach(() => fetchMock.mockRestore());

  it('réessaie quand le fournisseur est surchargé, puis renvoie la réponse', async () => {
    fetchMock
      .mockResolvedValueOnce(failure(503))
      .mockResolvedValueOnce(reply('Fermé le dimanche.'));

    await expect(build().reply(profile, history)).resolves.toBe(
      'Fermé le dimanche.',
    );
    expect(fetchMock).toHaveBeenCalledTimes(2);
  });

  it('abandonne après trois tentatives et donne le code du fournisseur', async () => {
    fetchMock.mockImplementation(() => Promise.resolve(failure(503)));

    const error = await build()
      .reply(profile, history)
      .catch((e: unknown) => e);
    expect(error).toBeInstanceOf(ServiceUnavailableException);
    expect((error as Error).message).toContain('code 503');
    expect(fetchMock).toHaveBeenCalledTimes(3);
  });

  it('ne réessaie pas une erreur définitive (modèle inconnu)', async () => {
    fetchMock.mockResolvedValueOnce(failure(404));

    await expect(build().reply(profile, history)).rejects.toThrow('code 404');
    expect(fetchMock).toHaveBeenCalledTimes(1);
  });

  it('utilise l’adresse et le modèle configurés, sinon Groq par défaut', async () => {
    fetchMock.mockImplementation(() => Promise.resolve(reply('ok')));

    await build({
      AI_API_KEY: 'k',
      AI_API_URL: 'https://exemple.test/v1/chat',
      AI_MODEL: 'modele-x',
    }).reply(profile, history);
    await build({ AI_API_KEY: 'k', AI_API_URL: '  ', AI_MODEL: '' }).reply(
      profile,
      history,
    );

    const [[firstUrl, firstInit], [secondUrl, secondInit]] = fetchMock.mock
      .calls as [string, RequestInit][];
    const modelOf = (init: RequestInit) =>
      (JSON.parse(init.body as string) as { model: string }).model;
    expect(firstUrl).toBe('https://exemple.test/v1/chat');
    expect(modelOf(firstInit)).toBe('modele-x');
    expect(secondUrl).toBe('https://api.groq.com/openai/v1/chat/completions');
    expect(modelOf(secondInit)).toBe('llama-3.3-70b-versatile');
  });

  it('refuse proprement sans clé', async () => {
    await expect(build({}).reply(profile, history)).rejects.toThrow(
      'AI_API_KEY manquante',
    );
    expect(fetchMock).not.toHaveBeenCalled();
  });
});
