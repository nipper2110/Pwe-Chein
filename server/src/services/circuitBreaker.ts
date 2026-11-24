/**
 * A circuit breaker for API-Football.
 *
 * Idea: if the provider tells us our account is suspended or out of requests, calling it again and again only
 * makes things worse (and can burn the quota). So we "open the circuit": for a cooldown period we do not call it
 * at all, and answer from saved data instead. When the cooldown ends we let ONE request through as a test
 * ("half-open"). If it works, the circuit closes and everything is normal again; if it fails, we wait again.
 *
 * One clear log line is written when it opens and when it closes, never one per blocked request.
 */
export class CircuitBreaker {
  private openUntil = 0; // 0 = closed
  private reason = "";
  private probing = false;

  constructor(
    private readonly now: () => number = Date.now,
    private readonly log: (line: string) => void = (line) => console.log(line),
  ) {}

  /** True if a call may be made right now. In the half-open state only one caller at a time gets true. */
  acquire(): boolean {
    if (this.openUntil === 0) return true;
    if (this.now() < this.openUntil) return false;
    if (this.probing) return false;
    this.probing = true;
    return true;
  }

  /** The call worked: the provider is healthy, close the circuit (and say so once). */
  onSuccess(): void {
    this.probing = false;
    if (this.openUntil === 0) return;
    this.openUntil = 0;
    this.log(`[breaker] CLOSED: API-Football answered normally again (it was open because: ${this.reason})`);
    this.reason = "";
  }

  /** The call failed in a way that does not justify opening the circuit (e.g. a network blip). */
  onFailure(): void {
    this.probing = false;
  }

  /** Open the circuit for `cooldownMinutes`. Does nothing if it is already open (many calls can fail together). */
  trip(cooldownMinutes: number, reason: string): void {
    this.probing = false;
    if (this.openUntil !== 0 && this.now() < this.openUntil) return;
    this.openUntil = this.now() + cooldownMinutes * 60_000;
    this.reason = reason;
    this.log(
      `[breaker] OPEN for ${cooldownMinutes} min (until ${new Date(this.openUntil).toISOString()}): ${reason}. ` +
        `No requests will be sent to API-Football until then; saved data is served instead.`,
    );
  }

  snapshot(): { open: boolean; until: string | null; reason: string | null } {
    const open = this.openUntil !== 0;
    return { open, until: open ? new Date(this.openUntil).toISOString() : null, reason: open ? this.reason : null };
  }
}

export const breaker = new CircuitBreaker();
