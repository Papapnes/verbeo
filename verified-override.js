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

const LEXICON_NOTE = {
  fr: "Formes issues de WordNet et du moteur morphologique lemminflect. Consultez la source pour les variantes de sens ou d’usage.",
  en: "Forms provided by WordNet and the lemminflect morphology engine. Check the source for meaning or usage variants.",
  ar: "الصيغ مستخرجة من WordNet ومحرك التصريف lemminflect. راجع المصدر للاطلاع على اختلافات المعنى والاستعمال.",
};

const RULE_NOTE = {
  fr: "Verbe confirmé par le dictionnaire. Formes régulières calculées selon les règles orthographiques anglaises.",
  en: "Verb confirmed by the dictionary. Regular forms calculated with English spelling rules.",
  ar: "أكد القاموس أن الكلمة فعل. حُسبت الصيغ المنتظمة وفق قواعد الإملاء الإنجليزية.",
};

function showWordNetNoun(v, dict, untaggedVerb, currentLanguage, extra) {
  const labels = POS_LABELS[currentLanguage];
  $("#classification-primary").textContent = labels.noun;
  $("#classification-other").textContent = untaggedVerb
    ? `${labels.also} : ${labels.verb} (${currentLanguage === "fr" ? "sens spécialisé" : currentLanguage === "ar" ? "معنى متخصص" : "specialized sense"})`
    : "";
  $("#badge").textContent = untaggedVerb
    ? (currentLanguage === "fr" ? "Nom — sens verbal spécialisé" : currentLanguage === "ar" ? "اسم — معنى فعلي متخصص" : "Noun — specialized verb sense")
    : labels.noun;
  $("#word").textContent = v;
  $("#rule").textContent = currentLanguage === "fr"
    ? "Aucune conjugaison affichée en mode apprentissage."
    : currentLanguage === "ar" ? "لا يُعرض أي تصريف في وضع التعلّم." : "No conjugation shown in learning mode.";
  $("#translation").textContent = "—";
  $("#definition").textContent = dict?.definition || (currentLanguage === "fr"
    ? "Mot identifié comme nom par Princeton WordNet."
    : currentLanguage === "ar" ? "صُنّفت هذه الكلمة اسماً في Princeton WordNet." : "Word identified as a noun by Princeton WordNet.");
  extra.note.textContent = untaggedVerb
    ? (currentLanguage === "fr" ? "Le sens nominal attesté est prioritaire ; l’emploi verbal n’apparaît pas dans le corpus annoté de WordNet." : currentLanguage === "ar" ? "تُعطى الأولوية للمعنى الاسمي الموثق؛ لم يظهر الاستعمال الفعلي في مجموعة WordNet المشروحة." : "The attested noun sense is prioritized; the verb use does not occur in WordNet's tagged corpus.")
    : (currentLanguage === "fr" ? "Classification grammaticale : Princeton WordNet 3.0." : currentLanguage === "ar" ? "التصنيف النحوي: Princeton WordNet 3.0." : "Part-of-speech classification: Princeton WordNet 3.0.");
  extra.source.href = "https://wordnet.princeton.edu/";
  extra.source.textContent = currentLanguage === "fr"
    ? "Source : Princeton WordNet 3.0"
    : currentLanguage === "ar" ? "المصدر: Princeton WordNet 3.0" : "Source: Princeton WordNet 3.0";
  hideConjugation();
  error.hidden = true;
  result.hidden = false;
  result.scrollIntoView({ behavior: "smooth", block: "nearest" });
}

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

function regularPresentParticiple(v) {
  if (v.endsWith("ie")) return `${v.slice(0, -2)}ying`;
  if (v.endsWith("e") && !v.endsWith("ee")) return `${v.slice(0, -1)}ing`;
  if (/[^aeiou][aeiou][^aeiouwxy]$/.test(v) && v.length <= 5) return `${v}${v.at(-1)}ing`;
  return `${v}ing`;
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

  const irr = VERIFIED_V[v];
  const reg = VERIFIED_R[v];
  const lexical = VERB_LEXICON[v];
  const nounOnly = WORDNET_NOUN_ONLY.has(v);
  const nounVerb = WORDNET_NOUN_VERBS.has(v);
  const untaggedVerb = WORDNET_UNTAGGED_VERBS.has(v);

  error.textContent = currentLanguage === "fr"
    ? "Vérification du mot…"
    : currentLanguage === "ar" ? "جارٍ التحقق من الكلمة…" : "Checking the word…";
  error.hidden = false;

  let dict = null;
  if ((!irr && !reg && !lexical) || nounOnly || untaggedVerb) {
    try { dict = await lookupWord(v); } catch (_) { /* Local data still works offline. */ }
  }

  // Manually verified verbs always win. For the remaining words, WordNet's
  // noun categories and corpus tag counts prevent ordinary nouns and unattested
  // rare verb senses from being presented as everyday verbs.
  if (!irr && !reg && (nounOnly || untaggedVerb)) {
    showWordNetNoun(v, dict, untaggedVerb, currentLanguage, extra);
    return;
  }
  const fallbackRegular = !irr && !reg && !lexical && Boolean(dict?.isVerb);

  if (!irr && !reg && !lexical && !fallbackRegular) {
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

  showClassification(dict || (nounVerb ? { parts: ["verb", "noun"] } : null), true);
  showConjugation();

  const p = irr ? irr[0] : lexical ? lexical[0] : past(v);
  const participle = irr ? irr[1] : lexical ? lexical[1] : p;
  const cleanPast = p.split(" / ")[0];
  const cleanParticiple = participle.split(" / ")[0];
  const sourceUrl = irr ? irr[5] : reg ? reg[2] : `https://dictionary.cambridge.org/dictionary/english/${encodeURIComponent(v)}`;
  const isIrregular = Boolean(irr || lexical?.[6]);

  $("#badge").textContent = isIrregular ? copy.irregular : copy.regular;
  $("#word").textContent = v;
  $("#rule").textContent = isIrregular ? copy.memorize : copy.rule;
  $("#base").textContent = v;
  $("#past-form").textContent = p;
  $("#part").textContent = participle;
  $("#present").textContent = v === "be" ? "I am" : `I ${v}`;
  $("#perfect").textContent = `I have ${cleanParticiple}`;
  $("#past-simple").textContent = v === "be" ? "I was" : `I ${cleanPast}`;
  $("#past-perfect").textContent = `I had ${cleanParticiple}`;
  $("#translation").textContent = irr ? irr[2] : reg ? reg[0] : lexical?.[5] || "—";
  $("#definition").textContent = irr ? irr[3] : reg ? reg[1] : lexical?.[4] || dict?.verbDefinition || dict?.definition || "Definition unavailable.";
  extra.note.textContent = irr?.[4] || (lexical ? LEXICON_NOTE[currentLanguage] : RULE_NOTE[currentLanguage]);
  extra.source.href = sourceUrl;
  extra.source.textContent = SOURCE_LABEL[currentLanguage];

  error.hidden = true;
  result.hidden = false;
  result.scrollIntoView({ behavior: "smooth", block: "nearest" });
};
