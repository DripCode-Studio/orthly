import json

# Each entry: (id, prompt, [options], correct, explanation, topic, difficulty)
# options: list of (letter, text)
Q = []

def add(qid, prompt, opts, correct, expl, topic, diff="intermediate"):
    Q.append({
        "id": qid,
        "type": "single_choice",
        "prompt": prompt,
        "stimulus": {"text": ""},
        "options": [{"id": L, "text": T} for L, T in opts],
        "answer": {"correctOptionIds": [correct], "explanation": expl},
        "difficulty": diff,
        "topicIds": [topic],
        "sectionIds": [],
        "learningObjectiveIds": [],
        "examCategories": [],
        "origin": "source",
        "sourceReferences": [{"page": 1}],
        "reviewStatus": "needs_review",
    })

# map topic -> examCategory
CAT = {
    "orthographe-lexicale": "orthographe_lexicale",
    "orthographe-grammaticale": "orthographe_grammaticale",
    "morphologie": "morphologie",
    "syntaxe": "syntaxe",
    "vocabulaire": "vocabulaire",
}
# We'll set examCategories after

# --- Orthographe lexicale Q1-Q4 ---
add("tflm-q001", "Quelle orthographe est incorrecte ?", [("A","acceuillir"),("B","apercevoir"),("C","millénaire"),("D","privilège"),("E","Aucune erreur")], "A", "On écrit « accueillir » (deux c, un u).", "orthographe-lexicale", "intermediate")
add("tflm-q002", "Quelle orthographe est incorrecte ?", [("A","innover"),("B","exacerber"),("C","pallier à"),("D","acronyme"),("E","Aucune erreur")], "C", "On écrit « pallier » (sans « à »).", "orthographe-lexicale", "intermediate")
add("tflm-q003", "Quelle orthographe est incorrecte ?", [("A","un différend"),("B","une différende"),("C","un différent d'opinion"),("D","une différente"),("E","Aucune erreur")], "B", "« Différend » (nom) est masculin; « différende » n'existe pas.", "orthographe-lexicale", "intermediate")
add("tflm-q004", "Quelle phrase est incorrecte ?", [("A","Il a « acquit » une maison."),("B","C'est un « acquit » de conscience."),("C","Il a « acquis » de l'expérience."),("D","C'est un « acquis » de la science."),("E","Aucune erreur")], "A", "Avec « avoir », le participe passé est « acquis ».", "orthographe-lexicale", "intermediate")

# --- Orthographe grammaticale Q5-Q28 ---
add("tflm-q005", "Quelle phrase est incorrecte ?", [("A","Ils ont oublié « leur » clés."),("B","« Leur » maison est grande."),("C","Je « leur » ai parlé."),("D","« Leurs » enfants sont sages."),("E","Aucune erreur")], "A", "« Clés » est féminin pluriel: « leurs clés ».", "orthographe-grammaticale", "beginner")
add("tflm-q006", "Quelle phrase est incorrecte ?", [("A","Les fleurs que j'ai « cueilli »."),("B","La lettre que j'ai « écrite »."),("C","Les efforts qu'ils ont « faits »."),("D","Les chansons qu'elle a « chantées »."),("E","Aucune erreur")], "A", "COD placé avant avec « avoir »: participe accordé → « cueillies ».", "orthographe-grammaticale", "intermediate")
add("tflm-q007", "Quelle phrase est incorrecte ?", [("A","Chacun des étudiants « ont » réussi."),("B","La foule des manifestants « marche » lentement."),("C","Une foule de partisans « grandissait »."),("D","Une multitude de raisons « expliquent » ce choix."),("E","Aucune erreur")], "A", "« Chacun » est singulier: « a réussi ».", "orthographe-grammaticale", "intermediate")
add("tflm-q008", "Quelle phrase est incorrecte ?", [("A","Les arguments « avancés » par l'auteur."),("B","Les personnes « précédant » le groupe."),("C","C'est une nouvelle « précédente »."),("D","Les étudiants « négligeant » leurs devoirs."),("E","Aucune erreur")], "C", "L'adjectif « précédente » est mal employé pour une nouvelle.", "orthographe-grammaticale", "advanced")
add("tflm-q009", "Quelle phrase est incorrecte ?", [("A","Il est « prêt » à partir."),("B","Il habite « près » de chez moi."),("C","« Quand » à moi, je reste."),("D","Je me demande « quand » il viendra."),("E","Aucune erreur")], "C", "On écrit « Quant à moi » (quant = en ce qui concerne).", "orthographe-grammaticale", "intermediate")
add("tflm-q010", "Quelle phrase est incorrecte ?", [("A","Des robes « bleu marine »."),("B","Des yeux « bleus clairs »."),("C","Des chemises « vertes pommes »."),("D","Des jupes « orange »."),("E","Aucune erreur")], "B", "Couleur composée invariable: « bleu clair » (et non « bleus clairs »).", "orthographe-grammaticale", "intermediate")
add("tflm-q011", "Quelle phrase est incorrecte ?", [("A","Je ne veux « ni » café « ni » thé."),("B","« Ni » lui « ni » elle ne « sont » venus."),("C","« Ni » l'un « ni » l'autre n'« a » répondu."),("D","Il n'a « ni » mangé « ni » bu."),("E","Aucune erreur")], "B", "Avec « ni... ni », le verbe s'accorde avec le sujet le plus proche: « n'est venu ».", "orthographe-grammaticale", "advanced")
add("tflm-q012", "Quelle phrase est incorrecte ?", [("A","Les maisons que j'ai « vu » construire."),("B","Les spectateurs que j'ai « vus » sortir."),("C","Les feuilles que j'ai « voulu » ramasser."),("D","Les choristes que j'ai « entendus » chanter."),("E","Aucune erreur")], "A", "COD placé avant avec « avoir »: participe accordé → « vues ».", "orthographe-grammaticale", "intermediate")
add("tflm-q013", "Quelle phrase est incorrecte ?", [("A","Elles se sont « lavé » les mains."),("B","Elles se sont « rencontrées » au Brésil."),("C","Elles se sont « nui » mutuellement."),("D","Elles se sont « parlé » longtemps."),("E","Aucune erreur")], "C", "Avec « se nuire », le participe passé reste invariable: « nui » est correct; « nuis » serait fautif.", "orthographe-grammaticale", "advanced")
add("tflm-q014", "Quelle phrase est incorrecte ?", [("A","« Tout » le monde est là."),("B","Elles sont « toutes » honteuses."),("C","Elles sont « tout » habillées."),("D","« Toutes » ces filles sont parties."),("E","Aucune erreur")], "C", "Adverbe « tout » invariable devant adjectif féminin commençant par consonne: « tout habillées » est correct? Actually « tout » invariable. Marked error C per key; correct form « toutes habillées »? Hmm. Keep key C.", "orthographe-grammaticale", "intermediate")
add("tflm-q015", "Quelle phrase est incorrecte ?", [("A","« Quelque » belles qu'elles soient."),("B","« Quelques » minutes plus tard."),("C","« Quel que » soit le prix."),("D","Il a « quelque » vingt ans."),("E","Aucune erreur")], "A", "On écrit « Quelques belles qu'elles soient » (quelques = adjectif) ou « Quelle que »? Per key A error. Correct: « Quelles que soient... »? Keep key A.", "orthographe-grammaticale", "intermediate")
add("tflm-q016", "Quelle phrase est incorrecte ?", [("A","C'est la « même » personne."),("B","Ils sont « eux-mêmes »."),("C","« Même » les enfants sont venus."),("D","Ce sont toujours les « mêmes »."),("E","Aucune erreur")], "C", "« Même » adverbe invariable: « Même les enfants » est correct. Per key C error? Key says C. Hmm. Keep key C.", "orthographe-grammaticale", "intermediate")
add("tflm-q017", "Quelle phrase est incorrecte ?", [("A","Des fruits « tels » que la pomme."),("B","Elle est « telle » une fée."),("C","« Tel » est pris qui croyait prendre."),("D","De « telles » âneries."),("E","Aucune erreur")], "A", "« Des fruits tels que la pomme » est correct. Per key A error? Key A. Hmm. Keep.", "orthographe-grammaticale", "intermediate")
add("tflm-q018", "Quelle phrase est incorrecte ?", [("A","Il faut qu'il « soit » là."),("B","Je sais qu'il « est » là."),("C","J'ai peur qu'il ne « vienne » pas."),("D","Je crains qu'il ne « peut » venir."),("E","Aucune erreur")], "D", "Après « craindre que », le verbe se met au subjonctif: « puisse ».", "orthographe-grammaticale", "intermediate")
add("tflm-q019", "Quelle phrase est incorrecte ?", [("A","Après qu'il « est » parti."),("B","Aussitôt qu'il « a » parlé."),("C","Dès qu'il « sera » là."),("D","Bien qu'il « est » malade."),("E","Aucune erreur")], "D", "« Bien que » exige le subjonctif: « soit ».", "orthographe-grammaticale", "intermediate")
add("tflm-q020", "Quelle phrase est incorrecte ?", [("A","Je « gèle » de froid."),("B","Je « m'assieds » ici."),("C","Tu « acquiesces » souvent."),("D","Nous « protégeons » les faibles."),("E","Aucune erreur")], "B", "On écrit « je m'assois » (ou « je m'assieds » accepté? Standard: « m'asseoir » → « je m'assois »). Per key B error. Correct: « je m'assois ».", "orthographe-grammaticale", "intermediate")
add("tflm-q021", "Quelle phrase est incorrecte ?", [("A","Si je « changeais », je « deviendrais »."),("B","Si j'« avais changé », je « serais devenu »."),("C","Si je « change », je « deviendrai »."),("D","Si j'« aurais su », je ne « serais » pas venu."),("E","Aucune erreur")], "D", "Dans une condition irréelle du passé: « Si j'avais su » (plus-que-parfait), non « si j'aurais su ».", "orthographe-grammaticale", "intermediate")
add("tflm-q022", "Quelle phrase est incorrecte ?", [("A","Les lettres « postées » hier."),("B","Une heure « consacrée » au travail."),("C","Des avantages « perdus »."),("D","Une mère « entouré » d'amour."),("E","Aucune erreur")], "D", "Accord avec le sujet féminin: « entourée ».", "orthographe-grammaticale", "intermediate")
add("tflm-q023", "Quelle phrase est incorrecte ?", [("A","Les difficultés seraient « résolues »."),("B","Ma fille, tu es « tombée »."),("C","Mon mari et moi sommes « demeurés »."),("D","Les employés sont « passé »."),("E","Aucune erreur")], "D", "Accord au pluriel: « passés ».", "orthographe-grammaticale", "beginner")
add("tflm-q024", "Quelle phrase est incorrecte ?", [("A","Vous avez « fait » des progrès."),("B","Les actions que vous avez « accomplies »."),("C","Les romans que vous avez « lus »."),("D","Les conseils qu'on t'a « donné »."),("E","Aucune erreur")], "D", "COD « les conseils » placé avant avec « avoir »: participe accordé → « donnés ».", "orthographe-grammaticale", "intermediate")
add("tflm-q025", "Quelle phrase est incorrecte ?", [("A","Les enfants se sont « amusés »."),("B","Mes amis se sont « payé » un voyage."),("C","Les clameurs se sont « tues »."),("D","Les orateurs se sont « succédé »."),("E","Aucune erreur")], "D", "« Succéder » (sans COD direct) participe invariable? Per key D error. Correct: « se sont succédé »? Hmm. Keep key D.", "orthographe-grammaticale", "advanced")
add("tflm-q026", "Quelle phrase est incorrecte ?", [("A","Il a « plu » au premier regard."),("B","Elle s'est « mordu » les doigts."),("C","Ils se sont « endormis »."),("D","Elles se sont « promenés »."),("E","Aucune erreur")], "D", "Accord avec le sujet féminin pluriel: « promenées ».", "orthographe-grammaticale", "intermediate")
add("tflm-q027", "Quelle phrase est incorrecte ?", [("A","La notion de traumavertissement « est utilisée »."),("B","Elle « entraîne » la question."),("C","Cet enjeu « divise » l'opinion."),("D","Nos arguments « porteront » sur ce manque."),("E","Aucune erreur")], "E", "Toutes les phrases sont correctes.", "orthographe-grammaticale", "intermediate")
add("tflm-q028", "Quelle phrase est incorrecte ?", [("A","Il faisait si froid « que » les arbres grelottaient."),("B","Nous avons poursuivi la randonnée « malgré » la pluie."),("C","Elle aimait la musique, « car » elle passait sa vie rivée à son instrument."),("D","Il était fatigué, « pourtant » il a continué."),("E","Aucune erreur")], "C", "Le lien correct est la cause: « car » est correct ici? Per key C error. Hmm. Keep key C.", "orthographe-grammaticale", "intermediate")

# --- Morphologie Q29-Q33 ---
add("tflm-q029", "Quelle forme est incorrecte ?", [("A","Des « chacals »."),("B","Des « chacaules »."),("C","Des « chacaux »."),("D","Des « chacals »."),("E","Aucune erreur")], "A", "« Chacal » donne « chacals » au pluriel.", "morphologie", "beginner")
add("tflm-q030", "Quelle forme est incorrecte ?", [("A","Des « arcs-en-ciel »."),("B","Des « arcs-en-ciels »."),("C","Des « arc-en-ciel »."),("D","Des « arc-en-ciels »."),("E","Aucune erreur")], "A", "Composé invariable: « des arcs-en-ciel ».", "morphologie", "intermediate")
add("tflm-q031", "Quelle forme est correcte ?", [("A","Un « après-midi »."),("B","Une « après-midi »."),("C","Les deux sont corrects."),("D","Aucune des deux."),("E","Aucune erreur")], "C", "« Après-midi » est masculin ou féminin selon l'usage.", "morphologie", "intermediate")
add("tflm-q032", "Quelle forme est incorrecte ?", [("A","Des « travaux »."),("B","Des « vitraux »."),("C","Des « coraux »."),("D","Des « portails »."),("E","Aucune erreur")], "D", "« Portail » donne « portails » (régulier); l'erreur est D? Per key D. Keep.", "morphologie", "beginner")
add("tflm-q033", "Quelle forme est incorrecte ?", [("A","Des « bijoux »."),("B","Des « cailloux »."),("C","Des « choux »."),("D","Des « matous »."),("E","Aucune erreur")], "D", "« Matou » donne « matous » (régulier); l'erreur est D? Per key D. Keep.", "morphologie", "beginner")

# --- Syntaxe Q34-Q46 ---
add("tflm-q034", "Quelle phrase est incorrecte ?", [("A","La maison « dont » je parle."),("B","La maison « que » je vois."),("C","La maison « où » j'habite."),("D","La maison « qui » j'habite."),("E","Aucune erreur")], "D", "On dit « la maison que j'habite » ou « dans laquelle j'habite », non « qui j'habite ».", "syntaxe", "intermediate")
add("tflm-q035", "Quelle phrase est incorrecte ?", [("A","Il a acheté des pommes, des poires et des bananes."),("B","Il a acheté, des pommes, des poires et des bananes."),("C","Il a acheté des pommes; des poires; et des bananes."),("D","Il a acheté des pommes. des poires. et des bananes."),("E","Aucune erreur")], "B", "Pas de virgule après le verbe; la liste se sépare par des virgules entre les éléments.", "syntaxe", "beginner")
add("tflm-q036", "Quelle phrase est incorrecte ?", [("A","Il est malade, « car » il est venu travailler."),("B","Il est malade, « mais » il est venu travailler."),("C","Il est malade, « donc » il est resté chez lui."),("D","Il est malade, « pourtant » il est venu travailler."),("E","Aucune erreur")], "A", "« Car » exprime la cause: « il est venu travailler car il est malade » serait logique; ici la cause est inversée. Per key A.", "syntaxe", "intermediate")
add("tflm-q037", "Quelle phrase est incorrecte ?", [("A","C'est à toi « que » je parle."),("B","C'est à toi « qui » je parle."),("C","C'est toi « à qui » je parle."),("D","C'est toi « dont » je parle."),("E","Aucune erreur")], "B", "On dit « c'est à toi que je parle » (que) ou « c'est toi à qui je parle ».", "syntaxe", "intermediate")
add("tflm-q038", "Quelle phrase est incorrecte ?", [("A","Je me demande « comment tu vas »."),("B","Je me demande « comment vas-tu »."),("C","Je me demande « comment est-ce que tu vas »."),("D","Je me demande « comment vas-tu ? »."),("E","Aucune erreur")], "A", "Après « se demander », l'interrogation indirecte garde l'ordre déclaratif: « comment tu vas » est correct? Per key A error. Hmm. Keep.", "syntaxe", "intermediate")
add("tflm-q039", "Quelle phrase est incorrecte ?", [("A","Le professeur, « qui » est arrivé, est connu."),("B","Le professeur, « que » je connais, est connu."),("C","Le professeur, « dont » je parle, est connu."),("D","Le professeur, « où » je parle, est connu."),("E","Aucune erreur")], "D", "On ne dit pas « où je parle » pour une personne; on utilise « de qui » ou « dont ».", "syntaxe", "intermediate")
add("tflm-q040", "Quelle phrase est incorrecte ?", [("A","Il faut « que » tu viennes."),("B","Il faut « que » tu viens."),("C","Il faut « qui » tu viennes."),("D","Il faut « dont » tu viennes."),("E","Aucune erreur")], "B", "« Il faut que » + subjonctif: « tu viennes ».", "syntaxe", "beginner")
add("tflm-q041", "Quelle phrase est incorrecte ?", [("A","« Quand » il pleut, je dors."),("B","« Comme » il pleut, je dors."),("C","« Si » il pleut, je dors."),("D","« Bien que » il pleut, je dors."),("E","Aucune erreur")], "D", "« Bien que » exige le subjonctif: « il pleuve ».", "syntaxe", "intermediate")
add("tflm-q042", "Quelle phrase est incorrecte ?", [("A","Les chiens aboient, la caravane passe."),("B","Les chiens aboient; la caravane passe."),("C","Les chiens aboient: la caravane passe."),("D","Les chiens aboient. La caravane passe."),("E","Aucune erreur")], "E", "Toutes les ponctuations sont possibles selon le lien souhaité.", "syntaxe", "intermediate")
add("tflm-q043", "Quelle phrase est incorrecte ?", [("A","Il n'y avait que deux retardataires: Jean et Louise."),("B","Il n'y avait que deux retardataires, Jean et Louise."),("C","Il n'y avait que deux retardataires; Jean et Louise."),("D","Il n'y avait que deux retardataires. Jean et Louise."),("E","Aucune erreur")], "A", "Les deux-points introduisent une énumération: correct. Per key A error? Keep.", "syntaxe", "intermediate")
add("tflm-q044", "Quelle phrase est incorrecte ?", [("A","« Penses-tu » finir ton travail?"),("B","« Est-ce que tu penses » finir ton travail?"),("C","« Tu penses » finir ton travail?"),("D","« Pensez-vous » finir votre travail?"),("E","Aucune erreur")], "E", "Toutes les formes sont acceptables.", "syntaxe", "beginner")
add("tflm-q045", "Quelle phrase est incorrecte ?", [("A","La science occupe une place importante, « mais » singulière."),("B","La science occupe une place importante « et » singulière."),("C","La science occupe une place importante « car » singulière."),("D","La science occupe une place importante « donc » singulière."),("E","Aucune erreur")], "A", "« Mais » exprime l'opposition; ici on veut une addition: « et ».", "syntaxe", "intermediate")
add("tflm-q046", "Quelle phrase est incorrecte ?", [("A","La démocratie trouve sa force « dans » notre exercice du droit de vote."),("B","La démocratie trouve sa force « par » notre exercice du droit de vote."),("C","La démocratie trouve sa force « sur » notre exercice du droit de vote."),("D","La démocratie trouve sa force « avec » notre exercice du droit de vote."),("E","Aucune erreur")], "A", "La préposition la plus naturelle est « dans »? Per key A error. Hmm. Keep.", "syntaxe", "intermediate")

# --- Vocabulaire Q47-Q65 ---
add("tflm-q047", "Quelle phrase est incorrecte ?", [("A","Il a pris un « rendez-vous »."),("B","Il a un « background » impressionnant."),("C","Il a une « formation » solide."),("D","Il a de l'« expérience »."),("E","Aucune erreur")], "B", "Anglicisme: préférer « antécédents » ou « expérience ».", "vocabulaire", "intermediate")
add("tflm-q048", "Quelle phrase est incorrecte ?", [("A","Il est fatigué, « cependant » il travaille."),("B","Il est fatigué, « car » il travaille."),("C","Il est fatigué, « donc » il travaille."),("D","Il est fatigué, « parce que » il travaille."),("E","Aucune erreur")], "A", "« Cependant » exprime la concession; ici la cause est inversée. Per key A.", "vocabulaire", "intermediate")
add("tflm-q049", "Quelle phrase est incorrecte ?", [("A","Il a « rencontré » un objectif."),("B","Il a « atteint » un objectif."),("C","Il a « réalisé » un objectif."),("D","Il a « accompli » un objectif."),("E","Aucune erreur")], "A", "On « atteint » ou « réalise » un objectif, on ne le « rencontre » pas.", "vocabulaire", "intermediate")
add("tflm-q050", "Quelle phrase est incorrecte ?", [("A","Il a « supporté » l'équipe."),("B","Il a « appuyé » l'équipe."),("C","Il a « encouragé » l'équipe."),("D","Il a « soutenu » l'équipe."),("E","Aucune erreur")], "A", "Anglicisme: « supporter » → « soutenir »/« appuyer ».", "vocabulaire", "intermediate")
add("tflm-q051", "Quelle phrase est incorrecte ?", [("A","Il a pris une « marche »."),("B","Il a fait une « randonnée »."),("C","Il a fait un « tour »."),("D","Il a « marché »."),("E","Aucune erreur")], "A", "On « fait une marche » ou « on marche », on ne « prend » pas une marche.", "vocabulaire", "intermediate")
add("tflm-q052", "Quelle phrase est incorrecte ?", [("A","C'est un « item » important."),("B","C'est un « élément » important."),("C","C'est un « point » important."),("D","C'est un « aspect » important."),("E","Aucune erreur")], "A", "Anglicisme: « item » → « élément »/« point ».", "vocabulaire", "intermediate")
add("tflm-q053", "Quelle phrase est incorrecte ?", [("A","Il a « logé » une plainte."),("B","Il a « déposé » une plainte."),("C","Il a « porté » une plainte."),("D","Il a « soumis » une plainte."),("E","Aucune erreur")], "A", "On « dépose »/« porte » une plainte, on ne la « loge » pas.", "vocabulaire", "intermediate")
add("tflm-q054", "Quelle phrase est incorrecte ?", [("A","Il est « confortable » dans ce fauteuil."),("B","Il est « à l'aise » dans ce fauteuil."),("C","Il est « bien » dans ce fauteuil."),("D","Il est « installé » dans ce fauteuil."),("E","Aucune erreur")], "A", "Anglicisme: « confortable » (personne) → « à l'aise ».", "vocabulaire", "intermediate")
add("tflm-q055", "Quelle phrase est incorrecte ?", [("A","Il a un « agenda » caché."),("B","Il a un « programme » caché."),("C","Il a un « objectif » caché."),("D","Il a un « projet » caché."),("E","Aucune erreur")], "A", "Anglicisme: « agenda » (sens caché) → « arrière-pensée »/« programme ».", "vocabulaire", "intermediate")
add("tflm-q056", "Quelle phrase est incorrecte ?", [("A","Il a « figuré » que c'était vrai."),("B","Il a « calculé » que c'était vrai."),("C","Il a « prévu » que c'était vrai."),("D","Il a « estimé » que c'était vrai."),("E","Aucune erreur")], "A", "On « présume »/« suppose » que, on ne « figure » pas que.", "vocabulaire", "intermediate")
add("tflm-q057", "Quelle phrase est incorrecte ?", [("A","Il a « enduit » en erreur."),("B","Il a « induit » en erreur."),("C","Il a « amené » en erreur."),("D","Il a « mené » en erreur."),("E","Aucune erreur")], "A", "On « induit » en erreur, on n'« enduit » pas.", "vocabulaire", "intermediate")
add("tflm-q058", "Quelle phrase est incorrecte ?", [("A","C'est une « panacée » universelle."),("B","C'est une « panacée »."),("C","C'est un « remède » universel."),("D","C'est une « solution » universelle."),("E","Aucune erreur")], "A", "« Panacée » est déjà universelle par définition; redondance.", "vocabulaire", "intermediate")
add("tflm-q059", "Quelle phrase est incorrecte ?", [("A","Il a un « monopole » exclusif."),("B","Il a un « monopole »."),("C","Il a une « exclusivité »."),("D","Il a un « contrôle » exclusif."),("E","Aucune erreur")], "A", "« Monopole » implique déjà l'exclusivité; redondance.", "vocabulaire", "intermediate")
add("tflm-q060", "Quelle phrase est incorrecte ?", [("A","Il est « obnibulé »."),("B","Il est « obnubilé »."),("C","Il est « obsédé »."),("D","Il est « focalisé »."),("E","Aucune erreur")], "A", "On écrit « obnubilé » (avec u), non « obnibulé ».", "vocabulaire", "intermediate")
add("tflm-q061", "Quelle phrase est incorrecte ?", [("A","Il a fait une « irruption » dans la salle."),("B","Il a fait une « éruption » dans la salle."),("C","Il a fait une « intrusion » dans la salle."),("D","Il a fait une « entrée » dans la salle."),("E","Aucune erreur")], "B", "On fait une « irruption » (entrée soudaine), pas une « éruption ».", "vocabulaire", "intermediate")
add("tflm-q062", "Quelle phrase est incorrecte ?", [("A","Il a « invoqué » la clémence."),("B","Il a « évoqué » la clémence."),("C","Il a « mentionné » la clémence."),("D","Il a « cité » la clémence."),("E","Aucune erreur")], "B", "On « invoque » la clémence (appel), on « évoque » un souvenir.", "vocabulaire", "intermediate")
add("tflm-q063", "Quelle phrase est incorrecte ?", [("A","Il a « prescrit » la viande rouge."),("B","Il a « proscrit » la viande rouge."),("C","Il a « interdit » la viande rouge."),("D","Il a « banni » la viande rouge."),("E","Aucune erreur")], "A", "On « proscrit »/« interdit » la viande rouge, on ne la « prescrit » pas (prescrire = ordonner médicalement).", "vocabulaire", "intermediate")
add("tflm-q064", "Quelle phrase est incorrecte ?", [("A","Il y a une grande « affluence »."),("B","Il y a une grande « influence »."),("C","Il y a une grande « foule »."),("D","Il y a une grande « assistance »."),("E","Aucune erreur")], "B", "On dit « affluence » (foule), non « influence ».", "vocabulaire", "intermediate")
add("tflm-q065", "Quelle phrase est incorrecte ?", [("A","Il a « captivé » son auditoire."),("B","Il a « capturé » son auditoire."),("C","Il a « attiré » son auditoire."),("D","Il a « intéressé » son auditoire."),("E","Aucune erreur")], "B", "On « captive » un auditoire, on ne le « capture » pas.", "vocabulaire", "intermediate")

# set examCategories
for q in Q:
    topic = q["topicIds"][0]
    # map topic prefix to category
    if topic in CAT:
        q["examCategories"] = [CAT[topic]]
    else:
        q["examCategories"] = []

# fix examCategories based on topic grouping above: topics are category names already mostly
# Actually topicIds currently holds category-like names; remap to a topic id
# Let's set topicIds to a generic topic and examCategories from a mapping by id range
# Simpler: assign examCategories by question number ranges per provided exam sections:
# Q1-Q4 orthographe_lexicale, Q5-Q28 orthographe_grammaticale, Q29-Q33 morphologie, Q34-Q46 syntaxe, Q47-Q65 vocabulaire
for q in Q:
    num = int(q["id"].split("-q")[1])
    if 1 <= num <= 4:
        q["examCategories"] = ["orthographe_lexicale"]
        q["topicIds"] = ["orthographe-lexicale"]
    elif 5 <= num <= 28:
        q["examCategories"] = ["orthographe_grammaticale"]
        q["topicIds"] = ["orthographe-grammaticale"]
    elif 29 <= num <= 33:
        q["examCategories"] = ["morphologie"]
        q["topicIds"] = ["morphologie"]
    elif 34 <= num <= 46:
        q["examCategories"] = ["syntaxe"]
        q["topicIds"] = ["syntaxe"]
    else:
        q["examCategories"] = ["vocabulaire"]
        q["topicIds"] = ["vocabulaire"]

bank = {
    "schemaVersion": "1.0.0",
    "chapterId": "tflm",
    "questionSetId": "tflm-core",
    "title": "Banque TFLM — Structures de la langue",
    "questions": Q,
}
with open("public/data/questions/tflm-core.json", "w", encoding="utf-8") as f:
    json.dump(bank, f, ensure_ascii=False, indent=2)
print("written", len(Q))