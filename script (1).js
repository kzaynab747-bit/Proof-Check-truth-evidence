(function () {
  var RULES = [
    { id: "urgency", label: "Pressure to act fast", weight: 2,
      re: [/\b(?:urgent(?:ly)?|immediately|right now|within \d+ ?(?:hours?|hrs?|minutes?|mins?)|expires? (?:in \d+ ?\w+|today|soon|tonight)|last chance|act now|today only|hurry|limited (?:time|stock)|final notice|order within \d+ ?\w+)\b/gi, /\b(?:jaldi|foran|fori|abhi|aaj hi|aakhri mauqa)\b/gi],
      why: "Deadlines push you to act before you can check. Honest senders usually allow time to confirm.",
      verify: "Ignore the deadline. Contact the organization through its official website and ask if the request is real.",
      eg: "expires in 2 hours, act now, jaldi" },
    { id: "fee", label: "Fee or deposit before anything happens", weight: 3,
      re: [/\b(?:registration|processing|joining|training|clearance|activation|delivery|booking) fees?\b|\b(?:security|refundable) deposit\b|\badvance (?:payment|fee|amount)\b|\bpay (?:in )?advance\b|\bpay (?:a |the )?(?:small )?fee\b/gi, /\b(?:fees?|raqam|paisay|paise) (?:jama|bhej)\w*/gi],
      why: "Real employers and shops rarely ask you to pay first. Upfront fees are one of the most common scam patterns.",
      verify: "Ask the company in writing whether any fee exists, using contact details from its official website.",
      eg: "registration fee, pay in advance" },
    { id: "channel", label: "Hard-to-trace payment channel", weight: 2,
      re: [/\b(?:easypaisa|jazz ?cash|western union|gift ?cards?|crypto(?:currency)?|bitcoin|usdt|wire transfer|bank transfer|send money|money transfer)\b/gi],
      why: "Payments to personal wallets, gift cards or crypto are hard to reverse once sent.",
      verify: "Check that the account name matches the business name. Prefer payment on delivery or a protected checkout.",
      eg: "Easypaisa, gift card, bank transfer" },
    { id: "secrecy", label: "Asks you to keep it secret", weight: 2,
      re: [/\bdo(?:n'?t| not) (?:tell|share|mention)(?: anyone| anybody| this)?\b/gi, /\bkeep (?:this|it) (?:a )?(?:secret|private|confidential)\b/gi, /\bbetween us\b/gi, /\btell no ?one\b/gi, /\bkisi ko (?:mat|na) (?:batana|batayen|batayein|bataiye)\b/gi, /\braaz\b/gi],
      why: "Secrecy stops friends and family from stepping in. Legitimate offers can be discussed openly.",
      verify: "Show the message to someone you trust before you reply or pay.",
      eg: "do not tell anyone, between us" },
    { id: "sensitive", label: "Asks for codes or private details", weight: 3,
      re: [/\b(?:otp|one[- ]time (?:code|password|pin)|verification code|security code|pin code|password|cvv|cnic|card number|bank details|login details)\b/gi],
      why: "Codes, passwords and ID numbers can give someone access to your accounts or identity.",
      verify: "Never share a code that was sent to you. Banks and services do not ask for it by message.",
      eg: "send your OTP, CNIC, password" },
    { id: "toogood", label: "Offer that sounds too good", weight: 2,
      re: [/\b(?:guaranteed|100% (?:guaranteed|safe|genuine|profit)|risk[- ]free|work from home|get rich|double your (?:money|investment)|\d{2}% off|you(?:'ve| have)? won|congratulations|free (?:iphone|gift|laptop)|ghar baithe|munafa|lottery|inaam|mubarak ho)/gi],
      why: "Big rewards for little effort are used as bait. If it sounds too good, compare it with normal prices and pay.",
      verify: "Search the seller or employer by name with words like \"reviews\" or \"complaints\". Compare the price with other shops.",
      eg: "90% off, you have won, guaranteed" },
    { id: "selection", label: "Hired or selected without a process", weight: 2,
      re: [/\byou(?: are|'re| have been|'ve been) (?:hired|selected|shortlisted)\b/gi, /\bno interview(?: needed| required| is needed)?\b/gi, /\bselect ho gaye\b/gi, /\baap select\b/gi],
      why: "Real hiring usually involves an application and an interview. Instant selection is a common lure.",
      verify: "Check the company on its official site or professional profiles, and confirm the job was really posted there.",
      eg: "you have been selected, no interview" },
    { id: "offplatform", label: "Moves you to a private chat", weight: 1,
      re: [/\b(?:whatsapp|telegram)\b/gi],
      why: "Moving to a private chat can take the conversation away from places that keep records or moderate scams.",
      verify: "Keep communication on the official platform or the company's listed email address when you can.",
      eg: "message us on WhatsApp" },
    { id: "shortener", label: "Shortened link", weight: 2,
      re: [/\b(?:bit\.ly|tinyurl\.com|t\.co|cutt\.ly|is\.gd|rb\.gy|shorturl\.at)\/\S+/gi],
      why: "Short links hide the real destination, so you cannot judge the site before you open it.",
      verify: "Do not open it. Type the company's official address into your browser instead.",
      eg: "bit.ly/phone-deal" },
    { id: "link", label: "Contains a link", weight: 1,
      re: [/\bhttps?:\/\/\S+/gi],
      why: "Links in unexpected messages can lead to look-alike pages that collect your details.",
      verify: "Check the domain name letter by letter, or go to the site by typing its address yourself.",
      eg: "https://..." },
    { id: "threat", label: "Account threat or prompt to click", weight: 2,
      re: [/\baccount (?:will be|has been|is) (?:suspended|blocked|closed|locked|deactivated)\b/gi, /\bverify your (?:account|identity|details)\b/gi, /\bunusual activity\b/gi, /\bclick (?:here|the link|below)\b/gi, /\bpackage (?:is )?(?:on hold|held)\b/gi, /\baccount (?:band|block) ho\b/gi],
      why: "Fear of losing an account or parcel is used to make you click without thinking.",
      verify: "Open the official app or website yourself and check your account there.",
      eg: "account will be suspended, click here" }
  ];

  var SAMPLES = {
    job: "Congratulations! You have been selected for a work from home data entry role. No interview needed. Pay the registration fee of Rs. 3,000 via Easypaisa today to confirm your seat. This offer expires in 2 hours. Do not tell anyone, and message us on WhatsApp.",
    shop: "FLASH SALE: iPhone 15 Pro for only Rs. 29,999, 90% off, limited stock! Pay in advance by bank transfer to reserve yours. Order within 30 minutes: bit.ly/phone-deal-now",
    ordinary: "Hi Sara, thanks for sending the report. Can we move tomorrow's meeting to 3 pm? I'll bring the updated budget sheet. Let me know if that works.",
    roman: "Mubarak ho! Aap select ho gaye hain. Ghar baithe munafa kamayen. Foran registration fee Easypaisa par bhej dein aur kisi ko mat batana. Apna CNIC aur OTP share karen."
  };
  var LEVELS = [
    { name: "No strong signals found", note: "Nothing matched the known patterns. That does not prove the message is safe, so check anything that asks for money or private details." },
    { name: "A few signals", note: "Some wording matched. Read the explanations below and verify before you act." },
    { name: "Check carefully", note: "Several warning patterns matched. Pause and verify through an official source before you reply or pay." },
    { name: "Higher concern", note: "Many warning patterns matched together. Do not pay or share codes until you have verified independently." }
  ];
  var GENERAL = [
    "Find the organization's official website yourself and use the contact details listed there, not only those in the message.",
    "Ask a trusted friend or family member to look at the message before you pay or share anything."
  ];

  var $ = function (id) { return document.getElementById(id); };
  var msg = $("msg"), report = $("report"), count = $("count"), statusEl = $("status");

  function esc(s) {
    return String(s).replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;");
  }

  function analyze(text) {
    var hits = [], found = {};
    RULES.forEach(function (rule) {
      rule.re.forEach(function (re) {
        var r = new RegExp(re.source, "gi"), m;
        while ((m = r.exec(text)) !== null) {
          if (m[0].length === 0) { r.lastIndex++; continue; }
          hits.push({ start: m.index, end: m.index + m[0].length, rule: rule });
          var list = found[rule.id] || (found[rule.id] = []);
          var phrase = m[0].trim();
          if (list.map(function (p) { return p.toLowerCase(); }).indexOf(phrase.toLowerCase()) === -1) list.push(phrase);
        }
      });
    });
    hits.sort(function (a, b) { return a.start - b.start || b.end - a.end; });
    var merged = [];
    hits.forEach(function (h) {
      var last = merged[merged.length - 1];
      if (last && h.start < last.end) {
        if (h.end > last.end) last.end = h.end;
        if (last.labels.indexOf(h.rule.label) === -1) last.labels.push(h.rule.label);
      } else {
        merged.push({ start: h.start, end: h.end, labels: [h.rule.label] });
      }
    });
    var triggered = RULES.filter(function (r) { return found[r.id]; });
    var score = triggered.reduce(function (s, r) { return s + r.weight; }, 0);
    var level = score === 0 ? 0 : score <= 2 ? 1 : score <= 5 ? 2 : 3;
    return { merged: merged, found: found, triggered: triggered, score: score, level: level };
  }

  function highlight(text, merged) {
    var out = "", pos = 0;
    merged.forEach(function (m) {
      out += esc(text.slice(pos, m.start));
      out += '<mark title="' + esc(m.labels.join(", ")) + '">' + esc(text.slice(m.start, m.end)) + "</mark>";
      pos = m.end;
    });
    return out + esc(text.slice(pos));
  }

  function render() {
    var text = msg.value;
    if (!text.trim()) {
      report.innerHTML = '<h3>Evidence report</h3><div class="empty">Paste a message on the left and select <strong>Analyze message</strong>. You will see the matching phrases, why they matter, and what to verify.</div>';
      statusEl.textContent = "Add some text first.";
      return;
    }
    var a = analyze(text), lv = LEVELS[a.level];
    var html = '<h3>Evidence report</h3>';
    html += '<div class="verdict"><div class="verdict-row"><span class="level">' + esc(lv.name) + '</span><span class="score">' + a.triggered.length + ' signal' + (a.triggered.length === 1 ? "" : "s") + ' · score ' + a.score + '</span></div>';
    html += '<div class="meter" data-level="' + a.level + '" role="img" aria-label="Concern level ' + (a.level + 1) + ' of 4"><i></i><i></i><i></i><i></i></div>';
    html += '<p class="note">' + esc(lv.note) + '</p></div>';
    html += '<div><p class="sub" style="margin-bottom:8px">Message with highlighted evidence</p><div class="msg">' + highlight(text, a.merged) + '</div></div>';
    if (a.triggered.length) {
      html += '<div><p class="sub" style="margin-bottom:8px">Why these phrases matter</p><ul class="signals">';
      a.triggered.forEach(function (r) {
        html += '<li class="signal"><div class="signal-head"><strong>' + esc(r.label) + '</strong><span class="weight">weight ' + r.weight + '</span></div>';
        html += '<div class="phrases">' + a.found[r.id].map(function (p) { return "<span>" + esc(p) + "</span>"; }).join("") + '</div>';
        html += '<p>' + esc(r.why) + '</p></li>';
      });
      html += '</ul></div>';
    }
    var steps = a.triggered.map(function (r) { return r.verify; }).concat(GENERAL);
    html += '<div><p class="sub" style="margin-bottom:8px">Suggested verification steps</p><ol class="verify">' + steps.map(function (s) { return "<li>" + esc(s) + "</li>"; }).join("") + '</ol></div>';
    html += '<p class="status">A warning pattern is a reason to investigate, not proof. This prototype uses simple text rules and can miss scams.</p>';
    report.innerHTML = html;
    statusEl.textContent = "Report updated. Nothing was uploaded.";
  }

  function updateCount() { count.textContent = msg.value.length + " / 8000"; }
  function setPressed(key) {
    document.querySelectorAll(".chip").forEach(function (c) { c.setAttribute("aria-pressed", c.getAttribute("data-sample") === key ? "true" : "false"); });
  }

  document.querySelectorAll(".chip").forEach(function (c) {
    c.addEventListener("click", function () {
      var key = c.getAttribute("data-sample");
      msg.value = SAMPLES[key]; setPressed(key); updateCount(); render();
    });
  });
  $("analyze").addEventListener("click", render);
  $("clear").addEventListener("click", function () { msg.value = ""; setPressed(""); updateCount(); render(); msg.focus(); });
  msg.addEventListener("input", function () { updateCount(); setPressed(""); });

  // list of signals in the page
  $("lib").innerHTML = RULES.map(function (r) {
    return '<article class="card"><h3>' + esc(r.label) + '</h3><p>' + esc(r.why) + '</p><div class="eg">' + esc(r.eg) + '</div></article>';
  }).join("");

  // light / dark switch
  $("themeBtn").addEventListener("click", function () {
    var root = document.documentElement, cur = root.getAttribute("data-theme");
    var dark = cur ? cur === "dark" : window.matchMedia("(prefers-color-scheme: dark)").matches;
    root.setAttribute("data-theme", dark ? "light" : "dark");
  });

  msg.value = SAMPLES.job; updateCount(); render();
})();
