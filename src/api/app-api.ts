import { APIRequestContext, expect } from '@playwright/test';
import { env, requireAccessKey } from '../config/env';
import { TestUser } from '../utils/test-data';
import { Todo } from '../models/todo-model';

export class AppApi {
  constructor(private readonly request: APIRequestContext) { }

  async register(user: TestUser) {
    const response = await this.request.post('/api/auth/register', {
      headers: this.accessHeaders({ 'Content-Type': 'application/json' }),
      data: {
        name: user.name,
        email: user.email,
        gender: user.gender,
        password: user.password,
        internalAnalyticsConsent: true,
      },
    });
    expect(response.ok(), await response.text()).toBeTruthy();
    return response;
  }

  async login(email: string, password: string): Promise<{ token: string; role: string }> {
    const response = await this.request.post('/api/auth/login', {
      headers: this.accessHeaders({ 'Content-Type': 'application/json' }),
      data: { email, password },
    });
    expect(response.ok(), await response.text()).toBeTruthy();
    return response.json();
  }

  async createUserAndLogin(user: TestUser): Promise<string> {
    await this.register(user);
    const login = await this.login(user.email, user.password);
    return login.token;
  }

  async createTodo(token: string, title: string) {
    const response = await this.request.post('/api/todos', {
      headers: {
        ...this.accessHeaders(),
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
      data: { title },
    });
    expect(response.ok(), await response.text()).toBeTruthy();
    return response.json();
  }

  async getProfile(token: string) {
    const response = await this.request.get('/api/profile', {
      headers: this.accessHeaders({ Authorization: `Bearer ${token}` }),
    });
    expect(response.ok(), await response.text()).toBeTruthy();
    return response.json();
  }

  async getAnalyticsEvents() {
    const credentials = Buffer.from(`${env.analyticsBasicUser}:${env.analyticsBasicPassword}`).toString('base64');
    const response = await this.request.get('/api/analytics/events', {
      headers: this.accessHeaders({
        Authorization: `Basic ${credentials}`,
      }),
    });
    expect(response.ok(), await response.text()).toBeTruthy();
    return response.json();
  }

  async getTodos(
    token: string,
    search = '',
    status = 'all'
  ): Promise<Todo[]> {
    const response = await this.request.get('/api/todos', {
      headers: {
        ...this.accessHeaders(),
        Authorization: `Bearer ${token}`,
      },
      params: {
        status,
        search,
        page: 1,
        limit: 5,
        sort: 'smart',
      },
    });

    expect(response.status()).toBeLessThan(400);
    const data = await response.json();
    return data.todos;
  }

  async deleteTodo(token: string, todoId: string) {
    const response = await this.request.delete(
      `/api/todos/${todoId}`,
      {
        headers: {
          ...this.accessHeaders(),
          Authorization: `Bearer ${token}`,
        },
      }
    );

    expect(response.ok(), await response.text()).toBeTruthy();
  }

  private accessHeaders(extra: Record<string, string> = {}): Record<string, string> {
    return {
      'X-Access-Key': requireAccessKey(),
      ...extra,
    };
  }
}
