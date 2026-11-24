# Translation notes

The site is available in **English (en)**, **Burmese (my)** and **Thai (th)**.
The Burmese and Thai texts were written by an AI assistant, not a native speaker, so please review
them. The list of things I am **not sure about** is in the second half of this file.

## How it works

| Part | Where |
|---|---|
| Translation texts | `client/src/i18n/locales/en.json`, `my.json`, `th.json` |
| Setup, language detection | `client/src/i18n/index.ts`, `languages.ts` |
| Dates, times, numbers | `client/src/hooks/useFormat.ts` |
| Server error messages | the server sends an error **code**; the browser looks up `errors.<CODE>` |
| Translating API labels (status, statistics...) | `client/src/hooks/useLabels.ts` |
| Language switchers | header (logged out), avatar menu, Account page |

- **Which language is used?** The profile language (if logged in) beats the choice saved on this device,
  which beats the browser's language list, which beats English.
- **Check your edits:** `npm run i18n:check` (in `client/`) tells you if a key is missing in one language,
  a `{{placeholder}}` was lost, a string is empty, or the code uses a key that does not exist.
  TypeScript also refuses to compile a misspelled key.
- **Adding or changing a text:** edit `en.json` first (it is the master), then `my.json` and `th.json`.
  Burmese and Thai have no singular/plural, so they only need the `_other` form of a plural text.
- Write numbers inside translations with Western digits (`8`, not `၈` or `๘`).

## Decisions I made (tell me if you disagree)

1. **Western digits (0-9) everywhere**, in all three languages: scores, minutes, statistics, years and dates.
   Burmese and Thai normally have their own digits; one setting in `i18n/languages.ts` (`nu-latn`) controls this.
2. **Thai dates use the Gregorian year** (2026, not the Buddhist year 2569), as requested.
3. **24-hour clock in every language** (`19:45`). English used to show `07:45 PM`; football fixtures
   read the same everywhere this way, and Burmese `နံနက်/ညနေ` markers are avoided.
4. **Times never depend on the language.** They always use the device's time zone.
5. **Burmese dates are formatted by our own code** when the browser has no Burmese data (the Chrome build I
   tested with had none and silently showed English). The names come from the official CLDR data and are
   checked against `Intl` (8,001 dates, 0 differences). Order is year, month, day, weekday:
   `2026 နို 22 တနင်္ဂနွေ`.
6. **Names stay in English:** teams, players, leagues, stadiums, coaches, referees.
7. **Burmese tone:** I mixed friendly-polite sentences (`...ပါတယ်`) with shorter written forms (`...သည်`).
   See "Review first" below.

## Not translated (stays English on purpose or because the API sends it)

- Team, player, league, venue, coach and referee names.
- **Country names** on the team page (the API sends "Italy", not a country code).
- **Table zone legend** under the standings, such as "UEFA Europa League" or "Promotion - Champions League (Play Offs...)".
  Only the plain word "Relegation" is translated.
- **Knockout round names** ("Round of 16", "Quarter-finals"...). "Regular Season - 12", "League Stage - 5" and
  "Group Stage - N" are translated.
- Statistic names we do not know yet, and match status codes we do not know, are shown as the API sends them.
- The word **API** in the season note, and the abbreviations **xG** and **VAR**.
- The browser tab title and description **before JavaScript runs** (`index.html`) are English.

## Review first (I am least sure about these)

### Burmese (`my.json`)

| Key | Text | Why I am unsure |
|---|---|---|
| `nav.myTeams` | ကိုယ့်အသင်းများ | "My teams". I chose "one's own teams" to stay neutral. Another option is ကျွန်ုပ်၏အသင်းများ. |
| `auth.login` / `auth.signup` | ဝင်ရောက်ရန် / အကောင့်ဖွင့်ရန် | Common alternatives: အကောင့်ဝင်ရန်, လော့ဂ်အင်. |
| `follow.follow` / `follow.unfollow` | စောင့်ကြည့်ရန် / စောင့်ကြည့်မှု ရပ်ရန် | "Follow a team" has no obvious everyday Burmese word. The second one is long. |
| `standings.pShort` ... `ptsShort` | ကစား, နိုင်, သရေ, ရှုံး, ဂိုးခြား, မှတ်, ပုံစံ | Table column abbreviations. I made these up; they must be short. |
| `stats.fouls` | ဖောက်ဖျက်မှု | Is there a more common football word? |
| `stats.expectedGoals`, `goalsPrevented` | မျှော်မှန်းဂိုး (xG), ကာကွယ်နိုင်သော ဂိုး | New concepts; not sure what Burmese fans say. |
| `stats.cornerKicks`, `freeKicks`, `offsides` | ထောင့်ကန်, ဖရီးကစ်, အော့ဖ်ဆိုက် | Mix of Burmese words and transliteration. |
| `team.cleanSheets` | ဂိုးမပေးရသောပွဲ | "Matches without conceding". Maybe there is a shorter term. |
| `team.topFormation` | အသုံးအများဆုံး ကစားပုံစနစ် | "Formation" (4-2-3-1). |
| `events.ownGoal` | မိမိဂိုးကိုယ်တိုင်သွင်းမိ | Correct but long. |
| `events.cardUpgrade`, `status.BT`, `status.AWD`, `status.WO`, `status.INT`, `status.SUSP` | various | Rare statuses; literal translations. |
| `timeline.HT` / `FT` / `AET` / `PEN` | ဝက်ချိန် / ပြီး / အပိုချိန်ပြီး / ပင်နယ်တီ | Short labels for the timeline pills. |
| `round.*` | ပုံမှန်ရာသီ - ပွဲစဉ် {{n}} ... | I added "ပွဲစဉ်" (round) to make "- 12" understandable. |
| `errors.rateLimited.*` | ... | Long sentences about being blocked; please check they sound polite, not scary. |
| **Register** (tone) | mixed | `ပါတယ်` (spoken-polite) and `သည်` (written) are mixed, e.g. `ရယူနေသည်` next to `ဒီနေ့`. Please choose one register and I will make all texts match. |

### Thai (`th.json`)

| Key | Text | Why I am unsure |
|---|---|---|
| `match.tabLineups` | ผู้เล่น | Short label for "Lineups". Maybe ตัวจริง or ผู้เล่นตัวจริง is better. |
| `standings.gdShort` | ได้เสีย | Abbreviation for goal difference. Thai tables often use ผลต่าง or +/-. |
| `team.cleanSheets` | คลีนชีต | Transliteration; Thai media also say "ไม่เสียประตู". |
| `team.topFormation` | แผนการเล่นที่ใช้บ่อยสุด | "Most used formation". |
| `stats.expectedGoals` | ประตูที่คาดหวัง (xG) | |
| `match.coach` | โค้ช | Could be ผู้จัดการทีม (manager). |
| `live.badge` | สด | One syllable fits the badge, but is "สด" clear enough for "LIVE"? |
| `timeline.PEN` / `status.P` | ดวลจุดโทษ | Shootout vs. a penalty during the game (`events.penalty` = จุดโทษ). |
| `nav.mobile`, `nav.main` | เมนูมือถือ, เมนูหลัก | Only read out by screen readers. |
| Politeness | none | No polite particles (ครับ/ค่ะ) on purpose, as is normal for UI text. |

### Google sign-in texts (new)

| Key | Why I am unsure |
|---|---|
| `auth.or` (`သို့မဟုတ်` / `หรือ`) | The small "or" between the form and the Google button. |
| `errors.USE_GOOGLE_SIGN_IN` | Tells someone who typed a password that their account was made with Google. It says "the Google button below". Check it is friendly and clear. |
| `errors.GOOGLE_EMAIL_UNVERIFIED` | Long: "Google has not verified this email, verify it or sign up with a password". |
| `errors.GOOGLE_ACCOUNT_CONFLICT`, `INVALID_GOOGLE_TOKEN`, `GOOGLE_NOT_CONFIGURED` | Short error messages. |
| `auth.googleSignIn` / `googleSignUp` | Only read by screen readers (the iframe's title). Google writes the visible button text itself. |

### Privacy Policy and Terms of Service (new, `privacy.*`, `terms.*`, `legal.*`, `footer.*`, `auth.agree`)

These are legal-style texts written by an AI. Please have a native speaker read them, and treat them as a summary of what the code does, not as legal advice.

| Key | Why I am unsure |
|---|---|
| `privacy.title` / `terms.title` (ကိုယ်ရေးကိုယ်တာ မူဝါဒ / ဝန်ဆောင်မှု စည်းမျဉ်းများ) | Standard-sounding names, but there may be a more common Burmese wording. |
| Whole Burmese pages | I used the friendly spoken style (`...ပါတယ်`) to keep them simple. A legal page may need the written style (`...ပါသည်`). English words kept on purpose: hash, cookie, local storage, httpOnly, script, spam, scraping, API. |
| `legal.lastUpdated` | The Burmese date is written `2026 နိုဝင်ဘာ 24` (same order as the rest of the site). The date is fixed text in the three JSON files: change it there when the policy changes. |
| `privacy.collect.email` | Explains "password hash" in one short phrase. Check it is understandable. |
| `terms.about.body` | `"ရှိတဲ့အတိုင်း"` for "as is" (no warranty). |
| Thai pages | Neutral written style, no polite particles. `ตามสภาพ` for "as is". |
| `footer.privacy` / `footer.terms` | Short forms (ကိုယ်ရေးကိုယ်တာ / စည်းမျဉ်းများ, ความเป็นส่วนตัว / ข้อกำหนด) so the footer fits on a phone. |
| `auth.agree` | One sentence with two links inside it; the word order of the links differs per language. |

**Change: from "portfolio project" to a public service (Nov 2026).** The pages now call Pwechein "a free football scores and fixtures service, operated by an individual, Chan Nyein Moe". Changed keys (same in en, my, th): `privacy.intro`, `terms.metaDescription`, `terms.about.body`, `terms.changes.body`, `privacy.deletion.body` ("ask me" is now "ask us"), `legal.contactText` (now names the operator). Burmese uses `ကျွန်ုပ်တို့` for "we" and `သင်` / `သင့်` for "you" in these pages. Things to check:

| Key | Why I am unsure |
|---|---|
| `terms.about.body` | "as is" and "as available" (`ရှိတဲ့အတိုင်း` / `ရနိုင်တဲ့အတိုင်း`, `ตามสภาพ` / `ตามที่มี`) are standard legal phrases that are hard to translate. |
| `privacy.intro`, `legal.contactText` | "operated by an individual" (`တစ်ဦးတည်းသော လူပုဂ္ဂိုလ်`, `บุคคลคนเดียว`) should read naturally, not stiff. |
| Legal status | A public service with real users may need a proper legal review (who is the data controller, GDPR/other local rules). These texts are not legal advice. |

### Both languages

- `season.label` (ရာသီ / ฤดูกาล) and the season note: "free API plan limit" is translated literally.
- `home.noMatches`: the number 6 (six leagues) is written as a digit.
- Burmese and Thai have **no plural forms**, so "1 assist" and "2 assists" use the same text.
