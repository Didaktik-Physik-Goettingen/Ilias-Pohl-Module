import { TestBed } from '@angular/core/testing';
import { vi } from 'vitest';

import { DataExport } from './data-export';
import { Analytics } from './analytics';
import { AttemptOutbox, AttemptRow } from './attempt-outbox';

describe('DataExport', () => {
  let service: DataExport;
  let outbox: AttemptOutbox;
  let fetchMock: ReturnType<typeof vi.fn>;

  const attempt = (questionId: string, questionText = ''): AttemptRow => ({
    kind: 'learning', unitId: 'mod', questionId, attemptNo: 1, isCorrect: true,
    answer: [], correctAnswer: [], texts: { questionText }, answeredAt: 1
  });

  beforeEach(() => {
    localStorage.clear();
    localStorage.setItem('framework_session_id', 'student-a');
    fetchMock = vi.fn().mockResolvedValue({ ok: true, status: 200 });
    vi.stubGlobal('fetch', fetchMock);
    TestBed.configureTestingModule({});
    service = TestBed.inject(DataExport);
    outbox = TestBed.inject(AttemptOutbox);
  });

  afterEach(() => vi.unstubAllGlobals());

  const sentBody = (call = 0) => JSON.parse(fetchMock.mock.calls[call][1].body);

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('calls the API relative to the base href, so it works below /pohl/', async () => {
    outbox.add(attempt('q1'));
    await service.saveProgress();
    expect(fetchMock.mock.calls[0][0]).toBe('api/progress/save');
  });

  it('sends a row until the server has confirmed it, and only then forgets it', async () => {
    outbox.add(attempt('q1'));
    fetchMock.mockResolvedValueOnce({ ok: false, status: 500 });
    await service.saveProgress();
    expect(outbox.getAll().length).toBe(1);

    await service.saveProgress();
    expect(sentBody(1).attempts.map((a: AttemptRow) => a.questionId)).toEqual(['q1']);
    expect(outbox.getAll()).toEqual([]);
  });

  it('sends nothing when nothing is new', async () => {
    await service.saveProgress();
    expect(fetchMock).not.toHaveBeenCalled();
  });

  it('marks visits as sent, so the next save leaves them out', async () => {
    const analytics = TestBed.inject(Analytics);
    const visit = { page: '/a', startTime: 1, sessionId: 's', timestamp: 'x', duration_s: 3 };
    vi.spyOn(analytics, 'getUnsentVisits').mockReturnValue([visit]);
    await service.saveProgress();
    expect(sentBody().visits).toEqual([{ page: '/a', startTime: 1, duration_s: 3 }]);
    expect(visit).toMatchObject({ sent: true });
  });

  it('stays below the keepalive limit and leaves the rest for the next save', async () => {
    for (let i = 0; i < 4; i++) outbox.add(attempt(`q${i}`, 'x'.repeat(25000)));
    await service.saveProgress();
    const body = fetchMock.mock.calls[0][1].body;
    expect(new Blob([body]).size).toBeLessThan(64 * 1024);
    expect(sentBody().attempts.length).toBe(2);
    expect(outbox.getAll().length).toBe(2);
  });
});
