import { APIRequestContext, expect } from '@playwright/test';
import fs from 'node:fs';
import { env, requireAccessKey } from '../config/env';
import { TestUser } from '../models/user-model';
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

    return response;
  }

  async login(email: string, password: string): Promise<{ token: string; role: string }> {
    const response = await this.loginRaw(email, password);
    expect(response.ok(), await response.text()).toBeTruthy();
    return response.json();
  }

  async loginRaw(email: string, password: string) {
    const response = await this.request.post('/api/auth/login', {
      headers: this.accessHeaders({ 'Content-Type': 'application/json' }),
      data: { email, password },
    });

    return response;
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

    const data = await response.json();

    return data.todo;
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
    const response = await this.getAnalyticsEventsRaw({
      Authorization: `Basic ${credentials}`,
    });
    expect(response.ok(), await response.text()).toBeTruthy();
    return response.json();
  }

  async getAnalyticsEventsRaw(headers: Record<string, string> = {}) {
    return this.request.get('/api/analytics/events', {
      headers: this.accessHeaders(headers),
    });
  }

  async getAnalyticsEventsWithoutAccessKey() {
    const credentials = Buffer.from(`${env.analyticsBasicUser}:${env.analyticsBasicPassword}`).toString('base64');
    return this.request.get('/api/analytics/events', {
      headers: {
        Authorization: `Basic ${credentials}`,
      },
    });
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

  async updateTodo(
    token: string,
    todoId: string,
    title: string
  ) {
    return this.patchTodo(token, todoId, { title });
  }

  async patchTodo(
    token: string,
    todoId: string,
    data: { title?: string; completed?: boolean }
  ) {
    const response = await this.request.patch(`/api/todos/${todoId}`, {
      headers: {
        ...this.accessHeaders(),
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
      data,
    });
    expect(response.ok(), await response.text()).toBeTruthy();

    const body = await response.json();

    return body.todo;
  }

  async updateProfile(
    token: string,
    data: { name?: string; gender?: '0' | '1'; internalAnalyticsConsent?: boolean; photo?: null }
  ) {
    const response = await this.request.patch('/api/profile', {
      headers: {
        ...this.accessHeaders(),
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
      data,
    });
    expect(response.ok(), await response.text()).toBeTruthy();

    return response.json();
  }

  async changePassword(token: string, newPassword: string, confirmPassword = newPassword) {
    const response = await this.request.post('/api/profile/password', {
      headers: {
        ...this.accessHeaders(),
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
      data: { newPassword, confirmPassword },
    });

    return response;
  }

  async uploadProfilePhoto(token: string, filePath: string) {
    const response = await this.request.post('/api/profile/photo', {
      headers: {
        ...this.accessHeaders(),
        Authorization: `Bearer ${token}`,
      },
      multipart: {
        photo: {
          name: filePath.split('/').pop() ?? 'profile-avatar.jpg',
          mimeType: 'image/jpeg',
          buffer: fs.readFileSync(filePath),
        },
      },
    });
    expect(response.ok(), await response.text()).toBeTruthy();

    return response.json();
  }

  async logout(token: string) {
    const response = await this.request.post('/api/auth/logout', {
      headers: {
        ...this.accessHeaders(),
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
      data: {},
    });
    expect(response.ok(), await response.text()).toBeTruthy();

    return response;
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
