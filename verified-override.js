/* Safe conjugation layer: only verified verbs receive generated forms. */
const SOURCE_LABEL = {
  fr: "Vérifier dans Cambridge Dictionary",
  en: "Verify in Cambridge Dictionary",
  ar: "تحقق في قاموس كامبريدج",
};

const UNVERIFIED = {
  fr: {
    badge: "Verbe non vérifié",
    rule: "Conjugaison non affichée : aucune forme n’est inventée.",
    message: "Ce mot est reconnu comme verbe, mais ses formes ne figurent pas encore dans la base vérifiée.",
  },
  en: {
    badge: "Unverified verb",
    rule: "Conjugation hidden: no form has been guessed.",
    message: "This word is recognized as a verb, but its forms are not yet in the verified database.",
  },
  ar: {
    badge: "فعل غير موثق",
    rule: "لم يُعرض التصريف لأن التطبيق لا يخمّن الصيغ.",
    message: "تم التعرف على الكلمة كفعل، لكن صيغها ليست بعد في قاعدة البيانات الموثقة.",
  },
};

function detailsExtras() {
  const card = document.querySelector("#definition").closest("article");
  let note = document.querySelector("#usage-note");
  let source = document.querySelector("#source-link");
  if (!note) {
    note = document.createElement("p");
    note.id = "usage-note";
    note.className = "usage-note";
    card.append(note);
  }
  if (!source) {
    source = document.createElement("a");
    source.id = "source-link";
    source.target = "_blank";
    source.rel = "noopener noreferrer";
    card.append(source);
  }
  return { note, source };
}

function hideConjugation() {
  document.querySelector(".forms").hidden = true;
  document.querySelector(".tenses").hidden = true;
  document.querySelector(".section-title").hidden = true;
}

function showConjugation() {
  document.querySelector(".forms").hidden = false;
  document.querySelector(".tenses").hidden = false;
  document.querySelector(".section-title").hidden = false;
}

show = async function showVerified(raw) {
  const v = raw.toLowerCase().trim().replace(/^to\s+/, "");
  const currentLanguage = lang.value;
  const copy = T[currentLanguage];
  const extra = detailsExtras();

  if (!/^[a-z]+$/.test(v)) {
    error.textContent = copy.invalid;
    error.hidden = false;
    result.hidden = true;
    return;
  }

  error.textContent = currentLanguage === "fr"
    ? "Vérification du mot…"
    : currentLanguage === "ar" ? "جارٍ التحقق من الكلمة…" : "Checking the word…";
  error.hidden = false;

  let dict = null;
  try { dict = await lookupWord(v); } catch (_) { /* Verified data still works offline. */ }

  const irr = VERIFIED_V[v];
  const reg = VERIFIED_R[v];

  if (!irr && !reg) {
    if (!dict) {
      error.textContent = currentLanguage === "fr"
        ? "Mot absent de la base vérifiée. Aucune conjugaison n’a été inventée."
        : currentLanguage === "ar"
          ? "الكلمة غير موجودة في القاعدة الموثقة، لذلك لم يتم تخمين تصريفها."
          : "Word absent from the verified database. No conjugation was guessed.";
      result.hidden = true;
      return;
    }

    const isVerb = Boolean(dict.isVerb);
    showClassification(dict, isVerb);
    $("#word").textContent = v;
    $("#translation").textContent = "—";
    $("#definition").textContent = dict.verbDefinition || dict.definition || "Definition unavailable.";
    extra.note.textContent = "";
    extra.source.href = `https://dictionary.cambridge.org/dictionary/english/${encodeURIComponent(v)}`;
    extra.source.textContent = SOURCE_LABEL[currentLanguage];

    if (isVerb) {
      const warning = UNVERIFIED[currentLanguage];
      $("#badge").textContent = warning.badge;
      $("#rule").textContent = warning.rule;
      extra.note.textContent = warning.message;
    } else {
      const label = POS_LABELS[currentLanguage][dict.primary] || dict.primary || POS_LABELS[currentLanguage].word;
      $("#badge").textContent = label;
      $("#rule").textContent = currentLanguage === "fr"
        ? "Ce mot n’est pas identifié comme verbe."
        : currentLanguage === "ar" ? "لم يتم التعرف على هذه الكلمة كفعل." : "This word is not identified as a verb.";
    }

    hideConjugation();
    error.hidden = true;
    result.hidden = false;
    result.scrollIntoView({ behavior: "smooth", block: "nearest" });
    return;
  }

  showClassification(dict, true);
  showConjugation();

  const p = irr ? irr[0] : past(v);
  const participle = irr ? irr[1] : p;
  const cleanPast = p.split(" / ")[0];
  const cleanParticiple = participle.split(" / ")[0];
  const sourceUrl = irr ? irr[5] : reg[2];

  $("#badge").textContent = irr ? copy.irregular : copy.regular;
  $("#word").textContent = v;
  $("#rule").textContent = irr ? copy.memorize : copy.rule;
  $("#base").textContent = v;
  $("#past-form").textContent = p;
  $("#part").textContent = participle;
  $("#present").textContent = v === "be" ? "I am" : `I ${v}`;
  $("#perfect").textContent = `I have ${cleanParticiple}`;
  $("#past-simple").textContent = v === "be" ? "I was" : `I ${cleanPast}`;
  $("#past-perfect").textContent = `I had ${cleanParticiple}`;
  $("#translation").textContent = irr ? irr[2] : reg[0];
  $("#definition").textContent = irr ? irr[3] : reg[1];
  extra.note.textContent = irr?.[4] || "";
  extra.source.href = sourceUrl;
  extra.source.textContent = SOURCE_LABEL[currentLanguage];

  error.hidden = true;
  result.hidden = false;
  result.scrollIntoView({ behavior: "smooth", block: "nearest" });
};
