import { Routes } from '@angular/router';
import { authGuard } from './core/guards/auth.guard';

export const routes: Routes = [
  // Pages publiques : présentation, site de démonstration et widget des sites clients
  {
    path: '',
    pathMatch: 'full',
    loadComponent: () => import('./pages/landing/landing').then((m) => m.LandingComponent),
  },
  {
    path: 'demo',
    loadComponent: () => import('./pages/demo/demo').then((m) => m.DemoComponent),
  },
  {
    path: 'widget/:key',
    loadComponent: () => import('./pages/widget/widget').then((m) => m.WidgetComponent),
  },
  {
    path: 'login',
    loadComponent: () => import('./pages/login/login').then((m) => m.LoginComponent),
  },
  {
    path: 'register',
    loadComponent: () => import('./pages/register/register').then((m) => m.RegisterComponent),
  },
  {
    path: '',
    loadComponent: () => import('./layout/layout').then((m) => m.LayoutComponent),
    canActivate: [authGuard],
    children: [
      {
        path: 'dashboard',
        loadComponent: () => import('./pages/dashboard/dashboard').then((m) => m.DashboardComponent),
      },
      {
        path: 'assistant',
        loadComponent: () => import('./pages/assistant/assistant').then((m) => m.AssistantComponent),
      },
      {
        path: 'chat',
        loadComponent: () => import('./pages/chat/chat').then((m) => m.ChatComponent),
      },
      {
        path: 'conversations',
        loadComponent: () => import('./pages/conversations/conversations').then((m) => m.ConversationsComponent),
      },
    ],
  },
  { path: '**', redirectTo: '' },
];
