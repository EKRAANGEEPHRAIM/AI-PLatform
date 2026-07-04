import { Directive, inject, input, effect, TemplateRef, ViewContainerRef } from '@angular/core';
import { AuthService } from '../services/auth.service';

@Directive({
  selector: '[appHasRole]',
  standalone: true,
})
export class HasRoleDirective {
  private readonly templateRef = inject(TemplateRef);
  private readonly viewContainer = inject(ViewContainerRef);
  private readonly authService = inject(AuthService);

  appHasRole = input.required<string | string[]>();

  private hasView = false;

  constructor() {
    effect(() => {
      const requiredRoles = this.appHasRole();
      const userRole = this.authService.currentUser()?.role;
      const roles = Array.isArray(requiredRoles) ? requiredRoles : [requiredRoles];
      const hasPermission = !!userRole && roles.includes(userRole);

      if (hasPermission && !this.hasView) {
        this.viewContainer.createEmbeddedView(this.templateRef);
        this.hasView = true;
      } else if (!hasPermission && this.hasView) {
        this.viewContainer.clear();
        this.hasView = false;
      }
    });
  }
}
