import { Component, inject, signal, ChangeDetectionStrategy, OnInit } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { AnalyticsService, type DashboardStats } from '../../core/services/analytics.service';
import { AuthService } from '../../core/services/auth.service';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div class="p-8">
      <!-- Header -->
      <div class="mb-8">
        <h1 class="text-3xl font-bold text-white">Dashboard</h1>
        <p class="text-slate-400 mt-1">Welcome back, {{ authService.currentUser()?.name }}</p>
      </div>

      <!-- Stats Grid -->
      @if (stats()) {
        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <!-- Total Conversations -->
          <div class="p-6 rounded-2xl bg-white/5 border border-white/10 hover:border-indigo-500/30 transition">
            <div class="flex items-center gap-4">
              <div class="w-12 h-12 rounded-xl bg-indigo-500/20 flex items-center justify-center">
                <svg class="w-6 h-6 text-indigo-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"/>
                </svg>
              </div>
              <div>
                <p class="text-2xl font-bold text-white">{{ stats()!.totalConversations }}</p>
                <p class="text-slate-400 text-sm">Total Conversations</p>
              </div>
            </div>
          </div>

          <!-- Active -->
          <div class="p-6 rounded-2xl bg-white/5 border border-white/10 hover:border-emerald-500/30 transition">
            <div class="flex items-center gap-4">
              <div class="w-12 h-12 rounded-xl bg-emerald-500/20 flex items-center justify-center">
                <svg class="w-6 h-6 text-emerald-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 10V3L4 14h7v7l9-11h-7z"/>
                </svg>
              </div>
              <div>
                <p class="text-2xl font-bold text-white">{{ stats()!.activeConversations }}</p>
                <p class="text-slate-400 text-sm">Active</p>
              </div>
            </div>
          </div>

          <!-- Resolved -->
          <div class="p-6 rounded-2xl bg-white/5 border border-white/10 hover:border-violet-500/30 transition">
            <div class="flex items-center gap-4">
              <div class="w-12 h-12 rounded-xl bg-violet-500/20 flex items-center justify-center">
                <svg class="w-6 h-6 text-violet-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"/>
                </svg>
              </div>
              <div>
                <p class="text-2xl font-bold text-white">{{ stats()!.resolvedConversations }}</p>
                <p class="text-slate-400 text-sm">Resolved</p>
              </div>
            </div>
          </div>

          <!-- Total Messages -->
          <div class="p-6 rounded-2xl bg-white/5 border border-white/10 hover:border-amber-500/30 transition">
            <div class="flex items-center gap-4">
              <div class="w-12 h-12 rounded-xl bg-amber-500/20 flex items-center justify-center">
                <svg class="w-6 h-6 text-amber-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M7 8h10M7 12h4m1 8l-4-4H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-3l-4 4z"/>
                </svg>
              </div>
              <div>
                <p class="text-2xl font-bold text-white">{{ stats()!.totalMessages }}</p>
                <p class="text-slate-400 text-sm">Total Messages</p>
              </div>
            </div>
          </div>
        </div>

        <!-- Avg messages card -->
        <div class="p-6 rounded-2xl bg-gradient-to-r from-indigo-500/10 to-violet-500/10 border border-indigo-500/20">
          <div class="flex items-center justify-between">
            <div>
              <p class="text-slate-400 text-sm">Average Messages per Conversation</p>
              <p class="text-4xl font-bold text-white mt-2">{{ stats()!.avgMessagesPerConversation }}</p>
            </div>
            <div class="w-16 h-16 rounded-2xl bg-indigo-500/20 flex items-center justify-center">
              <svg class="w-8 h-8 text-indigo-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"/>
              </svg>
            </div>
          </div>
        </div>
      } @else {
        <div class="flex items-center justify-center h-64">
          <div class="animate-pulse text-slate-400">Loading analytics...</div>
        </div>
      }
    </div>
  `,
})
export class DashboardComponent implements OnInit {
  protected readonly authService = inject(AuthService);
  private readonly analyticsService = inject(AnalyticsService);

  stats = signal<DashboardStats | null>(null);

  ngOnInit() {
    this.analyticsService.getDashboardStats().subscribe({
      next: (data) => this.stats.set(data),
      error: () => this.stats.set(null),
    });
  }
}
