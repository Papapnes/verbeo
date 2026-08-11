import streamlit as st
import streamlit.components.v1 as components

st.set_page_config(page_title="Verbéo", page_icon="📚", layout="wide")

VERBS = {
    "be": ("was / were", "been", "être", "Exister ou décrire un état, une identité ou une caractéristique."),
    "become": ("became", "become", "devenir", "Commencer à être quelque chose ou évoluer vers un nouvel état."),
    "begin": ("began", "begun", "commencer", "Démarrer une action, un événement ou une période."),
    "break": ("broke", "broken", "casser", "Endommager quelque chose au point qu'il ne fonctionne plus."),
    "bring": ("brought", "brought", "apporter", "Transporter quelque chose vers un lieu ou une personne."),
    "buy": ("bought", "bought", "acheter", "Obtenir quelque chose en échange d'argent."),
    "come": ("came", "come", "venir", "Se déplacer vers un lieu ou une personne."),
    "do": ("did", "done", "faire", "Réaliser une action ou accomplir une tâche."),
    "drink": ("drank", "drunk", "boire", "Avaler un liquide."),
    "drive": ("drove", "driven", "conduire", "Diriger et contrôler un véhicule."),
    "eat": ("ate", "eaten", "manger", "Consommer de la nourriture."),
    "feel": ("felt", "felt", "ressentir", "Éprouver une sensation, une émotion ou une impression."),
    "find": ("found", "found", "trouver", "Découvrir ou localiser quelque chose."),
    "get": ("got", "got / gotten", "obtenir", "Recevoir, acquérir ou parvenir à quelque chose."),
    "give": ("gave", "given", "donner", "Transférer quelque chose à une autre personne."),
    "go": ("went", "gone", "aller", "Se déplacer d'un lieu vers un autre."),
    "have": ("had", "had", "avoir", "Posséder ou faire l'expérience de quelque chose."),
    "hear": ("heard", "heard", "entendre", "Percevoir un son avec les oreilles."),
    "know": ("knew", "known", "savoir / connaître", "Posséder une information ou être familier avec quelqu'un."),
    "leave": ("left", "left", "partir / quitter", "S'éloigner d'un lieu ou abandonner quelque chose."),
    "make": ("made", "made", "faire / fabriquer", "Créer, produire ou construire quelque chose."),
    "meet": ("met", "met", "rencontrer", "Faire la connaissance de quelqu'un ou le retrouver."),
    "read": ("read", "read", "lire", "Comprendre un texte écrit en parcourant ses mots."),
    "run": ("ran", "run", "courir", "Se déplacer rapidement à pied."),
    "say": ("said", "said", "dire", "Exprimer quelque chose avec des mots."),
    "see": ("saw", "seen", "voir", "Percevoir quelque chose avec les yeux."),
    "speak": ("spoke", "spoken", "parler", "S'exprimer oralement."),
    "take": ("took", "taken", "prendre", "Saisir, emporter ou accepter quelque chose."),
    "teach": ("taught", "taught", "enseigner", "Transmettre des connaissances ou des compétences."),
    "tell": ("told", "told", "dire / raconter", "Communiquer une information ou une histoire."),
    "think": ("thought", "thought", "penser", "Utiliser son esprit pour réfléchir ou former une opinion."),
    "understand": ("understood", "understood", "comprendre", "Saisir le sens ou le fonctionnement de quelque chose."),
    "wear": ("wore", "worn", "porter", "Avoir un vêtement ou un accessoire sur soi."),
    "win": ("won", "won", "gagner", "Obtenir la victoire dans une compétition."),
    "write": ("wrote", "written", "écrire", "Former des mots ou composer un texte."),
}
REGULAR = {
    "work": ("travailler", "Effectuer une activité professionnelle ou accomplir une tâche."),
    "play": ("jouer", "Participer à un jeu, pratiquer un sport ou utiliser un instrument."),
    "study": ("étudier", "Consacrer du temps à l'apprentissage d'un sujet."),
    "watch": ("regarder", "Observer attentivement quelque chose."),
    "listen": ("écouter", "Prêter attention à un son ou à une personne."),
    "love": ("aimer", "Éprouver une forte affection ou beaucoup apprécier quelque chose."),
    "help": ("aider", "Apporter son soutien à quelqu'un."),
    "learn": ("apprendre", "Acquérir une connaissance ou une compétence."),
    "call": ("appeler", "Contacter quelqu'un ou lui donner un nom."),
    "open": ("ouvrir", "Déplacer ce qui ferme un passage ou un objet."),
    "close": ("fermer", "Mettre fin à une ouverture."),
    "visit": ("visiter", "Se rendre dans un lieu ou voir une personne."),
}
TEXT = {
    "FR": {"tag":"APPRENDRE L'ANGLAIS","title":"Un verbe, ses formes, et tout devient clair.","intro":"Saisissez un verbe anglais pour découvrir ses formes et ses principaux temps.","label":"Verbe anglais","placeholder":"Ex. go, work, study","check":"Vérifier","invalid":"Saisissez la forme de base avec des lettres uniquement.","regular":"Verbe régulier","irregular":"Verbe irrégulier","base":"Base verbale","past":"Prétérit","part":"Participe passé","conj":"Conjugaison avec « I »","translation":"En français","definition":"Définition","footer":"Votre compagnon pour maîtriser les verbes anglais."},
    "EN": {"tag":"LEARN ENGLISH","title":"One verb, all its forms, and everything becomes clear.","intro":"Enter an English verb to discover its forms and main tenses.","label":"English verb","placeholder":"E.g. go, work, study","check":"Check","invalid":"Enter the base form using letters only.","regular":"Regular verb","irregular":"Irregular verb","base":"Base form","past":"Past form","part":"Past participle","conj":"Conjugation with “I”","translation":"In French","definition":"Definition","footer":"Your companion for mastering English verbs."},
    "AR": {"tag":"تَعَلَّم الإنجليزية","title":"فعل واحد، كل تصريفاته، فتصبح الأمور واضحة.","intro":"أدخل فعلاً إنجليزياً لاكتشاف صيغه وأزمنته الأساسية.","label":"الفعل الإنجليزي","placeholder":"مثال: go, work, study","check":"تحقّق","invalid":"أدخل الصيغة الأساسية باستعمال الحروف فقط.","regular":"فعل منتظم","irregular":"فعل شاذ","base":"الصيغة الأساسية","past":"الماضي","part":"اسم المفعول","conj":"التصريف مع الضمير “I”","translation":"بالفرنسية","definition":"التعريف","footer":"رفيقك لإتقان الأفعال الإنجليزية."},
}

def regular_past(verb):
    if verb.endswith("e"):
        return verb + "d"
    if len(verb) > 1 and verb.endswith("y") and verb[-2] not in "aeiou":
        return verb[:-1] + "ied"
    if len(verb) <= 5 and len(verb) >= 3 and verb[-1] not in "aeiouwxy" and verb[-2] in "aeiou" and verb[-3] not in "aeiou":
        return verb + verb[-1] + "ed"
    return verb + "ed"

with st.sidebar:
    language = st.selectbox("Language / Langue / اللغة", ["FR", "EN", "AR"])
    night = st.toggle("🌙 Mode nuit", value=False)

t = TEXT[language]
bg, card, ink, muted = ("#111426","#1c2037","#f5f4ff","#b8bed1") if night else ("#f7f8ff","#ffffff","#17203b","#69728b")
direction = "rtl" if language == "AR" else "ltr"
st.markdown(f"""<style>
.stApp{{background:{bg};color:{ink};direction:{direction}}}
.block-container{{max-width:960px;padding-top:3rem}}
.hero{{padding:1rem 0 2rem}} .tag{{display:inline-block;background:#e8ff7a;color:#453b96;padding:.45rem .7rem;border-radius:999px;font-size:.72rem;font-weight:800;letter-spacing:.12em}}
.hero h1{{font-family:Georgia,serif;font-size:clamp(2.7rem,7vw,5rem);line-height:1;margin:.8rem 0;color:{ink}}}
.hero h1 span{{color:#7869ef}} .hero p{{color:{muted};font-size:1.08rem}}
.card{{background:{card};border:1px solid #484d6a55;border-radius:20px;padding:1.3rem;margin:.8rem 0;box-shadow:0 15px 40px #38306a18}}
.card small{{color:{muted};font-weight:800}} .card h3{{color:#7869ef;margin:.45rem 0}}
.footer{{border-top:1px solid #7774;padding-top:1.5rem;margin-top:3rem;color:{muted}}}
.footer a{{color:#7869ef;text-decoration:none;margin-right:1rem}}
</style>""", unsafe_allow_html=True)
st.markdown(f'<section class="hero"><span class="tag">{t["tag"]}</span><h1>{t["title"]}</h1><p>{t["intro"]}</p></section>', unsafe_allow_html=True)

with st.form("verb_form"):
    word = st.text_input(t["label"], placeholder=t["placeholder"]).strip().lower().removeprefix("to ")
    submitted = st.form_submit_button(t["check"], type="primary", use_container_width=True)

if submitted:
    if not word.isalpha() or not word.isascii():
        st.error(t["invalid"])
    else:
        irregular = VERBS.get(word)
        past = irregular[0] if irregular else regular_past(word)
        participle = irregular[1] if irregular else past
        clean_participle = participle.split(" / ")[0]
        st.success(t["irregular"] if irregular else t["regular"])
        c1, c2, c3 = st.columns(3)
        for col, label, value in [(c1,t["base"],word),(c2,t["past"],past),(c3,t["part"],participle)]:
            col.markdown(f'<div class="card"><small>{label}</small><h3>{value}</h3></div>', unsafe_allow_html=True)
        st.subheader(t["conj"])
        forms = [
            ("PRESENT SIMPLE", "I am" if word == "be" else f"I {word}"),
            ("PRESENT PERFECT", f"I have {clean_participle}"),
            ("PAST SIMPLE", "I was" if word == "be" else f"I {past.split(' / ')[0]}"),
            ("PAST PERFECT", f"I had {clean_participle}"),
        ]
        cols = st.columns(2)
        for i, (label, value) in enumerate(forms):
            cols[i % 2].markdown(f'<div class="card"><small>{label}</small><h3>{value}</h3></div>', unsafe_allow_html=True)
        translation = irregular[2] if irregular else REGULAR.get(word, ("—",""))[0]
        definition = irregular[3] if irregular else REGULAR.get(word, ("","Consultez un dictionnaire pour confirmer le sens selon le contexte."))[1]
        c1, c2 = st.columns([1, 2])
        c1.markdown(f'<div class="card"><small>🇫🇷 {t["translation"]}</small><h3>{translation}</h3></div>', unsafe_allow_html=True)
        c2.markdown(f'<div class="card"><small>💡 {t["definition"]}</small><p>{definition}</p></div>', unsafe_allow_html=True)
        components.html(f"""<button onclick="speechSynthesis.speak(new SpeechSynthesisUtterance('{word}'))" style="border:0;border-radius:10px;padding:10px 16px;background:#7869ef;color:white;font-weight:700;cursor:pointer">🔊 Listen</button>""", height=55)

st.markdown(f"""<div class="footer"><strong>Created by Abdel.B</strong><p>{t["footer"]}</p>
<a href="mailto:abdel.bouzourine.ti@gmail.com">✉ Courriel</a>
<a href="tel:+14382213326">☎ 438 221-3326</a>
<a href="https://www.linkedin.com/in/abdelkader-bouzourine-data-analyst/" target="_blank">in LinkedIn</a></div>""", unsafe_allow_html=True)
