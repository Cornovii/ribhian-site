/* Ribhian Games — event card renderer. Created by Ribhian Games LLC 2026© All Rights Reserved.
   Shared by events/events.html (public page) and events/event-admin.html (editor preview),
   so an event card is drawn exactly the same way in both places.
   Everything typed into an event is shown as plain text (HTML is escaped), so a description can
   never inject code into the site. */

(function (global) {
  'use strict';

  const MONTHS = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
  const DAYS   = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

  // Colour of the coloured system tag on each session
  const TAG_STYLES = {
    fantasy:    'Fantasy: Chronicles / Heroes of Ribhus (gold)',
    cyberpunk:  'Spiral Descent (cyan)',
    weirdwest:  'Madness & Dust (tan)',
    tendrils:   'Tendrils in the Fog (purple)',
    bloodstone: 'Blood & Stone (green)',
    core:       'The Core (amber)',
    aswi:       'All Star Wrestlers Investigate (red)',
    velvet:     'Velvet & Iron (rose)',
    truegame:   'True Game (blue)',
    community:  'Community / Open Gaming (lime)'
  };

  // Colour stripe down the left edge of the whole event card
  const CARD_STYLES = {
    multi:      'Mixed / several systems (crimson)',
    fantasy:    'Fantasy (gold)',
    cyberpunk:  'Spiral Descent (cyan)',
    weirdwest:  'Madness & Dust (tan)',
    tendrils:   'Tendrils in the Fog (purple)',
    bloodstone: 'Blood & Stone (green)',
    core:       'The Core (amber)',
    community:  'Community (lime)'
  };

  // Part-of-day sessions sort as if they started at these times
  const TOD_TIME = { 'All Day': '00:00', Morning: '09:00', Afternoon: '13:00', Evening: '18:00' };

  function esc(s) {
    return String(s == null ? '' : s).replace(/[&<>"']/g, c =>
      ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
  }

  function parseDate(s) {
    const [y, m, d] = String(s).slice(0, 10).split('-').map(Number);
    return new Date(y, m - 1, d);
  }

  function toISO(d) {
    return d.getFullYear() + '-' + String(d.getMonth() + 1).padStart(2, '0') + '-' + String(d.getDate()).padStart(2, '0');
  }

  function fmtTime(t) {
    if (!t) return '';
    let [h, m] = String(t).split(':').map(Number);
    const ap = h >= 12 ? 'PM' : 'AM';
    h = h % 12 || 12;
    return h + ':' + String(m).padStart(2, '0') + ' ' + ap;
  }

  // Calendar ordering rule: by date, then time (part-of-day sessions slot in at their usual time)
  function sortSessions(list, ev) {
    const fallbackDate = ev ? ev.start_date : '';
    return list.slice().sort((a, b) => {
      const da = a.session_date || fallbackDate, db = b.session_date || fallbackDate;
      if (da !== db) return da < db ? -1 : 1;
      const ta = (a.start_time || TOD_TIME[a.time_of_day] || '99:99').slice(0, 5);
      const tb = (b.start_time || TOD_TIME[b.time_of_day] || '99:99').slice(0, 5);
      if (ta !== tb) return ta < tb ? -1 : 1;
      return (a.sort_order || 0) - (b.sort_order || 0);
    });
  }

  // Calendar ordering rule for events: by start date, then by earliest session time
  function sortEvents(list, newestFirst) {
    const firstTime = ev => {
      const s = sortSessions(ev.event_sessions || [], ev)[0];
      return s ? (s.start_time || TOD_TIME[s.time_of_day] || '99:99').slice(0, 5) : '99:99';
    };
    const sorted = list.slice().sort((a, b) =>
      a.start_date !== b.start_date ? (a.start_date < b.start_date ? -1 : 1) : (firstTime(a) < firstTime(b) ? -1 : firstTime(a) > firstTime(b) ? 1 : 0));
    return newestFirst ? sorted.reverse() : sorted;
  }

  function isMultiDay(ev) { return ev.end_date && ev.end_date !== ev.start_date; }

  function sessionLabel(s, ev) {
    let time = '';
    if (s.start_time && s.end_time) time = fmtTime(s.start_time) + ' – ' + fmtTime(s.end_time);
    else if (s.start_time) time = fmtTime(s.start_time);
    else if (s.time_of_day) time = s.time_of_day;
    let day = '';
    if (isMultiDay(ev) && s.session_date) {
      const d = parseDate(s.session_date);
      day = MONTHS[d.getMonth()] + ' ' + d.getDate() + ' (' + DAYS[d.getDay()] + ')';
    }
    return [time, day].filter(Boolean).map(esc).join(' &nbsp;·&nbsp; ');
  }

  function dateBlock(ev) {
    const s = parseDate(ev.start_date), e = parseDate(ev.end_date || ev.start_date);
    let month = MONTHS[s.getMonth()], day = String(s.getDate()), year = String(s.getFullYear());
    if (+e !== +s) {
      if (e.getMonth() === s.getMonth() && e.getFullYear() === s.getFullYear()) {
        day = s.getDate() + '–' + e.getDate();
      } else {
        month = MONTHS[s.getMonth()] + '–' + MONTHS[e.getMonth()];
        day = s.getDate() + '–' + e.getDate();
        if (e.getFullYear() !== s.getFullYear()) year = s.getFullYear() + '–' + String(e.getFullYear()).slice(2);
      }
    }
    return '<div class="event-date-block">' +
      '<span class="event-date-month">' + esc(month) + '</span>' +
      '<span class="event-date-day">' + esc(day) + '</span>' +
      '<span class="event-date-year">' + esc(year) + '</span></div>';
  }

  // 'up' | 'now' | 'done', based on today's date
  function statusFor(ev, today) {
    const t = today || new Date(); t.setHours(0, 0, 0, 0);
    const s = parseDate(ev.start_date), e = parseDate(ev.end_date || ev.start_date);
    if (e < t) return 'done';
    if (s <= t) return 'now';
    return 'up';
  }

  const STATUS_HTML = {
    up:   '<span class="event-status">⚔ Upcoming</span>',
    now:  '<span class="event-status event-status--now">⚔ Happening Now</span>',
    done: '<span class="event-status event-status--done">✓ Completed</span>'
  };

  // Web, email and phone links only (never javascript: or other schemes)
  function safeUrl(u) {
    const v = String(u || '').trim();
    return /^(https?:\/\/|mailto:|tel:)/i.test(v) ? v : '';
  }

  // Registration button. show_button = false → none. Otherwise live only when the link is active,
  // valid and the event hasn't ended; else greyed out with a message that follows the date.
  function renderFooter(ev, st) {
    if (ev.show_button === false) return '';
    const url = safeUrl(ev.register_url);
    if (st !== 'done' && ev.link_active && url) {
      const web = /^https?:/i.test(url);
      return '<div class="event-footer"><a href="' + esc(url) + '"' + (web ? ' target="_blank" rel="noopener"' : '') +
        ' class="event-register">' + esc(String(ev.register_label || 'Register').trim() || 'Register') + ' ›</a></div>';
    }
    return '<div class="event-footer"><span class="event-register event-register--off">' +
      (st === 'done' ? 'Event Concluded' : 'Registration Link Coming Soon') + '</span></div>';
  }

  function renderMeta(meta) {
    const items = (Array.isArray(meta) ? meta : []).filter(m => m && String(m.value || '').trim());
    if (!items.length) return '';
    return '<div class="blurb-meta">' + items.map(m =>
      (String(m.label || '').trim() ? esc(m.label.trim()) + ': ' : '') + '<span>' + esc(m.value.trim()) + '</span>'
    ).join(' &nbsp;·&nbsp; ') + '</div>';
  }

  function paragraphs(text, cls) {
    return String(text || '').split(/\n\s*\n/).map(p => p.trim()).filter(Boolean)
      .map(p => '<p' + (cls ? ' class="' + cls + '"' : '') + '>' + esc(p).replace(/\n/g, '<br>') + '</p>').join('');
  }

  function renderSession(s, ev) {
    const style = TAG_STYLES[s.tag_style] ? s.tag_style : 'community';
    const blurbInner = renderMeta(s.meta) + paragraphs(s.blurb) + paragraphs(s.notes, 'blurb-notes');
    return '<div class="event-session">' +
      '<span class="session-time">' + sessionLabel(s, ev) + '</span>' +
      '<div class="session-info">' +
        '<p class="session-title">' + esc(s.title) + '</p>' +
        (String(s.tag_text || '').trim() ? '<span class="session-tag session-tag--' + style + '">' + esc(s.tag_text) + '</span>' : '') +
        (blurbInner ? '<div class="session-blurb">' + blurbInner + '</div>' : '') +
      '</div></div>';
  }

  function location(ev) {
    const parts = [ev.venue, ev.address].map(x => String(x || '').trim()).filter(Boolean);
    return parts.length ? '📍 ' + parts.map(esc).join(' &nbsp;·&nbsp; ') : '';
  }

  // Full card HTML for one event. status: 'up' | 'now' | 'done' (default: from today's date)
  function renderCard(ev, status) {
    const st = status || statusFor(ev);
    const style = CARD_STYLES[ev.card_style] ? ev.card_style : 'multi';
    const sessions = sortSessions(ev.event_sessions || [], ev);
    const anchor = String(ev.anchor || '').trim().replace(/[^a-z0-9_-]/gi, '');
    return '<div class="event-card ' + (st === 'done' ? 'is-past ' : '') + 'event-card--' + style + '"' +
        (anchor ? ' id="' + anchor + '"' : '') +
        ' data-start="' + esc(ev.start_date) + '" data-end="' + esc(ev.end_date || ev.start_date) + '"' +
        ' data-time="' + esc(sessions.length ? (sessions[0].start_time || TOD_TIME[sessions[0].time_of_day] || '99:99').slice(0, 5) : '99:99') + '">' +
      '<div class="event-card-header">' + dateBlock(ev) +
        '<div class="event-header-text">' +
          '<p class="event-convention">' + esc(ev.name) + '</p>' +
          (location(ev) ? '<p class="event-location">' + location(ev) + '</p>' : '') +
        '</div>' + STATUS_HTML[st] +
      '</div>' +
      (sessions.length ? '<div class="event-sessions">' + sessions.map(s => renderSession(s, ev)).join('') + '</div>' : '') +
      renderFooter(ev, st) +
    '</div>';
  }

  global.RibhianEvents = {
    TAG_STYLES, CARD_STYLES, MONTHS, DAYS,
    esc, parseDate, toISO, fmtTime, sortSessions, sortEvents, statusFor, renderCard, sessionLabel, safeUrl
  };
})(window);
