import { TestBed } from '@angular/core/testing';
import { vi } from 'vitest';

import { Session } from './session';
import { STORAGE_PREFIX } from './storage-prefix';

describe('Session', () => {
  const KEY = STORAGE_PREFIX + 'framework_session_id';
  let fetchMock: ReturnType<typeof vi.fn>;

  const create = () => {
    TestBed.resetTestingModule();
    return TestBed.inject(Session);
  };

  beforeEach(() => {
    localStorage.clear();
    fetchMock = vi.fn();
    vi.stubGlobal('fetch', fetchMock);
  });

  afterEach(() => vi.unstubAllGlobals());

  it('starts as a guest when nothing is known', () => {
    const session = create();
    expect(session.isRogueUser()).toBe(true);
    expect(localStorage.getItem(KEY)).toBe(session.sessionId());
  });

  it('takes the logged-in student from the server', async () => {
    fetchMock.mockResolvedValue({ ok: true, status: 200, json: async () => ({ username: 'resonanz42', cohort: 'ws2627' }) });
    const session = create();
    await session.resolve();
    expect(fetchMock.mock.calls[0][0]).toBe('../api/auth/me');
    expect(session.sessionId()).toBe('resonanz42');
    expect(session.isRogueUser()).toBe(false);
    expect(localStorage.getItem(KEY)).toBe('resonanz42');
  });

  it('becomes a guest when the server knows no login (logged out, or the old bridge\'s username)', async () => {
    localStorage.setItem(KEY, 'student-a');
    fetchMock.mockResolvedValue({ ok: false, status: 401 });
    const session = create();
    await session.resolve();
    expect(session.isRogueUser()).toBe(true);
  });

  it('keeps a guest\'s id across reloads', async () => {
    localStorage.setItem(KEY, 'rogue_user_1_abc');
    fetchMock.mockResolvedValue({ ok: false, status: 401 });
    const session = create();
    await session.resolve();
    expect(session.sessionId()).toBe('rogue_user_1_abc');
  });

  it('keeps the stored student when the server can\'t be reached, so their answers are still queued', async () => {
    localStorage.setItem(KEY, 'student-a');
    fetchMock.mockRejectedValue(new TypeError('offline'));
    const session = create();
    await session.resolve();
    expect(session.sessionId()).toBe('student-a');
  });

  it('ignores a session_id in the URL, as the old bridge sent it', () => {
    window.history.pushState({}, '', '/?session_id=someone-else');
    localStorage.setItem(KEY, 'student-a');
    expect(create().sessionId()).toBe('student-a');
    window.history.pushState({}, '', '/');
  });
});
