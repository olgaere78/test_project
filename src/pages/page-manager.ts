import { Page } from '@playwright/test';
import { AdminPage } from '../pages/admin-page';
import { AuthPage } from './auth-page';
import { DashboardPage } from './dashboard-page';
import { ProfilePage } from './profile-page';


export class App {
    readonly adminPage: AdminPage;
    readonly authPage: AuthPage;
    readonly dashboardPage: DashboardPage;
    readonly profilePage: ProfilePage;

    constructor(page: Page) {
        this.adminPage = new AdminPage(page);
        this.authPage = new AuthPage(page);
        this.dashboardPage = new DashboardPage(page);
        this.profilePage = new ProfilePage(page);
    }
}