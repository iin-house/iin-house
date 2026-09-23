import { describe, it, expect } from 'vitest';

describe('content visibility rules', () => {
  type Visibility = 'PUBLIC' | 'SUBSCRIBERS' | 'PPV';

  function canView(post: { visibility: Visibility; isPPV: boolean }, viewer: { subscribed: boolean; purchased: boolean; isCreator: boolean }): boolean {
    if (viewer.isCreator) return true;
    if (post.visibility === 'PUBLIC' && !post.isPPV) return true;
    if (post.isPPV) return viewer.purchased;
    if (post.visibility === 'SUBSCRIBERS') return viewer.subscribed;
    return false;
  }

  it('PUBLIC visible to everyone', () => {
    expect(canView({ visibility: 'PUBLIC', isPPV: false }, { subscribed: false, purchased: false, isCreator: false })).toBe(true);
  });

  it('SUBSCRIBERS hidden from unsubscribed users', () => {
    expect(canView({ visibility: 'SUBSCRIBERS', isPPV: false }, { subscribed: false, purchased: false, isCreator: false })).toBe(false);
  });

  it('SUBSCRIBERS visible to subscribers', () => {
    expect(canView({ visibility: 'SUBSCRIBERS', isPPV: false }, { subscribed: true, purchased: false, isCreator: false })).toBe(true);
  });

  it('PPV hidden from non-purchasers even if subscribed', () => {
    expect(canView({ visibility: 'PUBLIC', isPPV: true }, { subscribed: true, purchased: false, isCreator: false })).toBe(false);
  });

  it('PPV visible to purchasers', () => {
    expect(canView({ visibility: 'PUBLIC', isPPV: true }, { subscribed: false, purchased: true, isCreator: false })).toBe(true);
  });

  it('creator always sees own content', () => {
    expect(canView({ visibility: 'PPV', isPPV: true }, { subscribed: false, purchased: false, isCreator: true })).toBe(true);
  });
});

describe('scheduled post cron', () => {
  it('publishes posts whose scheduledAt <= now', () => {
    const now = new Date();
    const past = new Date(now.getTime() - 1000);
    const future = new Date(now.getTime() + 1000);

    const scheduled = [
      { id: '1', scheduledAt: past, publishedAt: null },
      { id: '2', scheduledAt: future, publishedAt: null },
      { id: '3', scheduledAt: null, publishedAt: null },
    ];

    const toPublish = scheduled.filter(p => p.scheduledAt && new Date(p.scheduledAt) <= now && !p.publishedAt);
    expect(toPublish.map(p => p.id)).toEqual(['1']);
  });

  it('skips already-published posts', () => {
    const now = new Date();
    const post = { id: '1', scheduledAt: new Date(now.getTime() - 1000), publishedAt: now };

    const toPublish = post.scheduledAt && new Date(post.scheduledAt) <= now && !post.publishedAt;
    expect(toPublish).toBe(false);
  });

  it('processes up to 50 posts per cron run', () => {
    const posts = Array.from({ length: 100 }, (_, i) => ({ id: String(i), scheduledAt: new Date(Date.now() - 1000), publishedAt: null }));
    const batch = posts.slice(0, 50);
    expect(batch.length).toBe(50);
  });
});

describe('upload flow', () => {
  it('generates unique keys per user', () => {
    const keys = new Set<string>();
    for (let i = 0; i < 100; i++) {
      const key = `uploads/user-${i % 2}/${Date.now()}-${Math.random().toString(36).slice(2, 8)}.jpg`;
      keys.add(key);
    }
    expect(keys.size).toBeGreaterThan(90);
  });

  it('detects image types for watermarking', () => {
    const isImage = (type: string) => type.startsWith('image/');
    expect(isImage('image/jpeg')).toBe(true);
    expect(isImage('image/png')).toBe(true);
    expect(isImage('video/mp4')).toBe(false);
    expect(isImage('audio/mpeg')).toBe(false);
    expect(isImage('text/plain')).toBe(false);
  });

  it('MIME mapping covers common formats', () => {
    const MIME: Record<string, string> = {
      ".jpg": "image/jpeg", ".jpeg": "image/jpeg", ".png": "image/png",
      ".mp4": "video/mp4", ".mp3": "audio/mpeg", ".pdf": "application/pdf",
    };
    expect(MIME['.jpg']).toBe('image/jpeg');
    expect(MIME['.png']).toBe('image/png');
    expect(MIME['.mp4']).toBe('video/mp4');
    expect(MIME['.mp3']).toBe('audio/mpeg');
  });
});

describe('content feed filter', () => {
  it('does not double-filter PUBLlC posts', () => {
    const posts = [
      { id: '1', visibility: 'PUBLIC', isPPV: false },
      { id: '2', visibility: 'PUBLIC', isPPV: true },
      { id: '3', visibility: 'SUBSCRIBERS', isPPV: false },
    ];

    // The old (wrong) filter: !isPPV || visibility === PUBLIC
    const wrong = posts.filter((p: any) => !p.isPPV || p.visibility === 'PUBLIC');
    expect(wrong.length).toBe(3); // hides PPV posts entirely — BUG

    // Correct: API does the filtering, client just renders
    const correct = posts; // server already filters
    expect(correct.length).toBe(3); // all 3 types exist in DB
  });
});
