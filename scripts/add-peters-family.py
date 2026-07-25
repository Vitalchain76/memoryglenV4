#!/usr/bin/env python3
"""Add Samuel, Ruth and James Peters to the memorial content pack.

Facts are taken from existing canon and must not drift:
  - GlenTab.tsx MARKERS (names, years, one-line notes)
  - TreeTab.tsx NODES (relations)
  - MemorialTab.tsx John's life story (Samuel a teacher, Ruth a nurse
    "whose kitchen fed a whole street", John born Mutare 14 March 1958)
  - GlenTab: Peters Family Glen established 1987, Glen Forest Memorial Park, Harare

All three are fictional demo personas, consistent with the John Peters demo.
They are marked `unlisted` so they render full memorial pages reachable from
the Family Glen and Family Tree, without appearing in the public /memorials
directory alongside the 19 general demo memorials.
"""
import json
from pathlib import Path

SRC = Path("src/data/memorials.json")

samuel = {
    "slug": "samuel-peters",
    "name": "Samuel Peters",
    "years": "1931–2001",
    "birthYear": 1931,
    "deathYear": 2001,
    "location": "Mutare",
    "tagline": "The Teacher Who Taught His Son the Worth of Work",
    "pronoun": "his",
    "features": [],
    "candles": 64,
    "communityMemorial": False,
    "unlisted": True,
    "biographyTitle": "His Life",
    "biography": [
        "Samuel Peters was born in 1931 in a village outside Mutare, in the eastern highlands where the mist sits low on the hills until mid-morning. He was the eldest of four, and the only one sent to school past Standard Three, because his mother sold two goats to pay for it and never once let him forget the arithmetic of that sacrifice.",
        "He trained as a teacher at a mission college in Manicaland, walking the last eleven miles of the journey there because the bus fare had gone on his registration. He used to tell that story to boys who complained about homework, and he told it without self-pity, as a simple statement of what a thing was worth.",
        "For thirty-four years he taught mathematics and Shona at schools around Mutare. He was not a soft teacher. He believed that a child flattered was a child cheated, and he marked accordingly. But he kept a tin of sweets in his desk drawer for the ones who came back after failing, and in thirty-four years he never once turned away a pupil who asked for extra help after hours.",
        "He married Ruth Chirwa in 1956. She was a nurse, quick where he was slow, and she teased him for reading the newspaper front to back including the classified advertisements. They had two sons — John in 1958 and James in 1961 — and a marriage of forty-five years that both of them described, separately and in almost the same words, as an argument they were glad never to have settled.",
        "He was ordained an elder in 1969 and served his congregation for thirty-two years. He read the lesson without notes. He visited the sick on Thursdays. When families in the congregation could not pay school fees, the money arrived anonymously, and everyone knew and no one said.",
        "He was a storyteller of the old kind, the kind who made you wait. His grandchildren remember the pause before the ending more vividly than most of the endings. He told the history of the family as though it were a serial, and he never told it the same way twice, which his sons regarded as either poor memory or excellent technique, depending on their mood.",
        "In his last decade he took up carpentry badly and gardening well. He built a bench for the veranda that leaned to the left and refused all offers to fix it, on the grounds that the lean was now part of the family. John later became a carpenter, and always said he did it partly to finish the argument.",
        "He fell ill in the winter of 2001 and died at home in Mutare in August, with Ruth reading to him and both sons in the room. He was seventy years old. The bench is still on the veranda. It still leans.",
        "The Peters Family Glen was established in 1987, and Samuel was the first of the family to rest there. He chose the place himself, walking the ground with John one Saturday and saying very little, which the family understood to mean approval.",
    ],
    "tributesTitle": "Tributes from His Family",
    "tributes": [
        "My father taught me that work has a worth you can name, and that a thing done badly is a debt you carry. I built a life on that sentence. — John, son",
        "He was strict with everyone except his grandchildren, and completely helpless with them. It was very annoying and I loved it. — James, son",
        "Forty-five years and he never learned to hurry. I have missed that slowness every day since. — Ruth, wife",
        "Sekuru told the same story a hundred times and it was different every time. I understand now that this was the point. — David, grandson",
        "Mr Peters failed me in Form Two and then taught me every Saturday morning for a year, for nothing. I became a teacher because of him. — Former pupil, Mutare",
        "He read the lesson without notes and visited the sick on Thursdays. Thirty-two years. You could set a calendar by him. — An elder of his congregation",
    ],
    "scripture": [
        "Let us not become weary in doing good, for at the proper time we will reap a harvest if we do not give up. — Galatians 6:9",
        "Train up a child in the way he should go: and when he is old, he will not depart from it. — Proverbs 22:6",
    ],
    "hymn": {
        "original": "Tinotenda Mwari wedu, nekururama kwenyu.",
        "language": "Shona",
        "translation": "We give thanks to our God, for your faithfulness.",
    },
    "poem": {
        "title": "Forever in Our Hearts",
        "lines": [
            "You walked eleven miles to sit an examination,",
            "And never once described it as a cost;",
            "You taught that effort is its own foundation,",
            "And nothing honestly attempted is lost.",
            "The bench you built still leans upon the veranda,",
            "We would not straighten it for all the world,",
            "Because the lean is yours, and so is the answer",
            "To every patient question that we asked.",
        ],
        "closing": "Rest in peace, Samuel. Your lessons outlived the bell.",
    },
    "favouriteSong": {
        "title": "Todii",
        "artist": "Oliver Mtukudzi",
        "description": "He was not a man for the radio, but he would stop what he was doing for Tuku, and once told John that a song which asks a question honestly is worth more than a sermon which answers one badly.",
        "youtubeSearch": "Oliver Mtukudzi Todii",
        "playlistNote": "Played at the close of his memorial service, at James's request.",
    },
    "voiceNote": {
        "title": "The Story of the Eleven Miles",
        "description": "Recorded on cassette by John in 1994, at a family gathering, without Samuel entirely realising. He tells the story of walking to the mission college — the version with the storm in it, which the grandchildren always claimed was the best one.",
        "duration": "2:08",
    },
    "galleryCaption": "Family memories: the veranda in Mutare, prize-giving days, the garden he tended better than he built furniture, and the bench that still leans.",
    "booklets": [
        "Memorial Invitation",
        "Order of Service",
        "Samuel Peters — Tributes Booklet",
        "Samuel Peters — Final Booklet",
    ],
    "restingPlace": {
        "name": "Peters Family Glen, Glen Forest Memorial Park, Harare",
        "description": "The first of the family to rest in the Peters Family Glen, established in 1987. He chose the ground himself, walking it one Saturday with John and saying very little. A msasa stands at the head of the plot; the family added a second when Ruth joined him ten years later.",
    },
    "timeline": [
        {"year": "1931", "title": "Born outside Mutare", "text": "Born in the eastern highlands, the eldest of four children."},
        {"year": "1952", "title": "Qualified as a teacher", "text": "Trained at a mission college in Manicaland, walking the last eleven miles to registration."},
        {"year": "1956", "title": "Married Ruth Chirwa", "text": "A marriage of forty-five years, and an argument both were glad never to settle."},
        {"year": "1969", "title": "Ordained an elder", "text": "Served his congregation in Mutare for thirty-two years, reading the lesson without notes."},
        {"year": "1986", "title": "Retired from teaching", "text": "After thirty-four years teaching mathematics and Shona around Mutare."},
        {"year": "2001", "title": "Laid to rest at Glen Forest", "text": "Died at home in Mutare aged seventy, and was the first to rest in the Peters Family Glen."},
    ],
    "images": {
        "portrait": {
            "prompt": "Dignified portrait photograph of an elderly Zimbabwean man in his late sixties, a retired schoolteacher, wearing a worn but pressed jacket and tie, gentle and unsmiling in the formal manner of an older generation, soft natural light, plain background",
            "stockSearch": "elderly african man formal portrait jacket",
        },
        "gallery": [
            {"prompt": "A wooden veranda of a modest Zimbabwean family home in the eastern highlands, morning mist on the hills beyond, a hand-built bench leaning slightly to one side", "stockSearch": "veranda african home hills morning"},
            {"prompt": "An old classroom in a rural Zimbabwean school, wooden desks, chalkboard with mathematics written in a careful hand, afternoon light through high windows", "stockSearch": "rural african classroom chalkboard desks"},
            {"prompt": "A well-tended vegetable garden behind a family home in Manicaland, neat rows, watering can, early evening light", "stockSearch": "african vegetable garden rows evening"},
            {"prompt": "Misty hills of the eastern highlands of Zimbabwe at dawn, layered ridges receding into pale light", "stockSearch": "eastern highlands zimbabwe mist hills"},
        ],
    },
}

ruth = {
    "slug": "ruth-peters",
    "name": "Ruth Peters",
    "years": "1935–2011",
    "birthYear": 1935,
    "deathYear": 2011,
    "location": "Mutare",
    "tagline": "The Nurse Whose Kitchen Fed a Whole Street",
    "pronoun": "her",
    "features": ["voiceNotes"],
    "candles": 91,
    "communityMemorial": False,
    "unlisted": True,
    "biographyTitle": "Her Life",
    "biography": [
        "Ruth Peters was born Ruth Chirwa in 1935, in Rusape, the third of seven children in a household where the youngest were raised largely by the eldest and everybody could cook by the age of nine. She said later that she learned nursing at home and only got the certificate afterwards.",
        "She trained at a mission hospital in Manicaland from 1954, in an intake of nineteen young women, and qualified in 1957. She worked as a nurse for thirty-eight years, most of them at the same hospital in Mutare, and rose to sister of the maternity ward, where she delivered — by the ward's own approximate count and her flat refusal to confirm it — something over four thousand children.",
        "She married Samuel Peters in 1956, a year before she qualified, against the mild advice of her supervisor. She used to say that she had chosen a slow man on purpose, having grown up in a house with too much hurry in it. They had two sons, John and James, and forty-five years together.",
        "Her kitchen in Mutare fed a whole street, and this is not a family exaggeration but something the street itself said. Sunday lunch had no guest list. If you arrived, you ate. Her sons grew up with the standing understanding that any friend could be brought home without warning, and that arriving without appetite was the only genuine rudeness.",
        "She was not sentimental. She was a nurse of the generation that did not weep in front of patients, and she carried that composure home with her. Her grandchildren learned to read her affection in practical forms: the food parcel that appeared, the school shoes that arrived a size too big so they would last, the letter written in a firm hand every fortnight to John in Johannesburg for twenty-six years.",
        "She grew roses badly and vegetables superbly, and considered the roses a personal failing she intended to correct. She was still intending to correct it at seventy-six.",
        "When Samuel died in 2001 she did not move house, did not shorten Sunday lunch, and did not, so far as anyone could establish, cry in company. She lived another ten years in the same rooms, and the street kept coming.",
        "She died in Mutare in March 2011, aged seventy-six, after a short illness she declined to describe as serious. John flew from Johannesburg; James drove through the night from Harare. She had asked for no fuss and received a great deal of it, which the family considered fair.",
        "She rests beside Samuel in the Peters Family Glen at Glen Forest. The family planted the second msasa at the head of the plot the week she was buried.",
    ],
    "tributesTitle": "Tributes from Her Family",
    "tributes": [
        "My mother wrote to me every fortnight for twenty-six years. I kept every letter. I did not tell her that, and I regret it. — John, son",
        "She fed the whole street and never once called it generosity. She called it Sunday. — James, son",
        "Ambuya bought my school shoes a size too big so they would last the year. I understood what that meant only much later. — Sarah, granddaughter",
        "She delivered my mother, and then she delivered me. In Mutare that was not unusual. That was Sister Peters. — A woman of the Mutare ward",
        "Forty-five years, and she chose a slow man on purpose. She told me that with a completely straight face. — Grace, daughter-in-law",
        "The roses never did come right. She was still annoyed about it at seventy-six. — Michael, grandson",
    ],
    "scripture": [
        "She openeth her mouth with wisdom; and in her tongue is the law of kindness. — Proverbs 31:26",
        "I was hungry and you gave me something to eat, I was a stranger and you invited me in. — Matthew 25:35",
    ],
    "hymn": {
        "original": "Ndinofamba naye, ndinofamba naJesu.",
        "language": "Shona",
        "translation": "I walk with him, I walk with Jesus.",
    },
    "poem": {
        "title": "Forever in Our Hearts",
        "lines": [
            "You set the table for whoever came,",
            "And never asked their business at the door;",
            "Four thousand children carry, in some name,",
            "The steady hands that met them here before.",
            "You wrote each fortnight in a firm dark hand",
            "To one far son who kept them, every one;",
            "The roses failed. The vegetables still stand.",
            "The street still comes on Sunday. It is done.",
        ],
        "closing": "Rest in peace, Ruth. The table is still set.",
    },
    "favouriteSong": {
        "title": "Amazing Grace",
        "artist": "Traditional",
        "description": "She sang it in the ward at the end of long night shifts, quietly and slightly flat, and the older midwives said you could tell how the night had gone by which verse she started on.",
        "youtubeSearch": "Amazing Grace traditional hymn choir",
        "playlistNote": "Sung by the maternity ward staff at the graveside, unaccompanied.",
    },
    "voiceNote": {
        "title": "Sunday Lunch Instructions",
        "description": "Recorded by Sarah on a mobile phone in 2009, in the kitchen in Mutare, ostensibly so that the recipe would not be lost. Ruth spends most of the recording refusing to give exact quantities on the grounds that measuring is for people who do not pay attention.",
        "duration": "1:47",
    },
    "galleryCaption": "Family memories: the kitchen in Mutare, Sunday lunches with no guest list, the maternity ward that knew her as Sister Peters, and the vegetable beds that always did better than the roses.",
    "booklets": [
        "Memorial Invitation",
        "Order of Service",
        "Ruth Peters — Tributes Booklet",
        "Ruth Peters — Final Booklet",
    ],
    "restingPlace": {
        "name": "Peters Family Glen, Glen Forest Memorial Park, Harare",
        "description": "She rests beside Samuel in the Peters Family Glen, ten years after him. The family planted a second msasa at the head of the plot the week she was buried, so that the two stand together.",
    },
    "timeline": [
        {"year": "1935", "title": "Born in Rusape", "text": "Third of seven children in a household where everyone could cook by nine."},
        {"year": "1957", "title": "Qualified as a nurse", "text": "Trained at a mission hospital in Manicaland, one of an intake of nineteen."},
        {"year": "1956", "title": "Married Samuel Peters", "text": "Married a year before qualifying, against her supervisor's mild advice."},
        {"year": "1972", "title": "Sister of the maternity ward", "text": "Took charge of the maternity ward in Mutare, where she served for over two decades."},
        {"year": "1995", "title": "Retired after thirty-eight years", "text": "Left nursing, but not the street; Sunday lunch continued unchanged."},
        {"year": "2011", "title": "Laid to rest at Glen Forest", "text": "Died in Mutare aged seventy-six and was buried beside Samuel in the family glen."},
    ],
    "images": {
        "portrait": {
            "prompt": "Dignified portrait photograph of an elderly Zimbabwean woman in her early seventies, a retired nurse, composed and direct expression, headscarf and simple blouse, soft natural light, plain background",
            "stockSearch": "elderly african woman portrait headscarf",
        },
        "gallery": [
            {"prompt": "A warm domestic kitchen in a Zimbabwean family home, pots on the stove, a long table laid for many people, afternoon light through a window", "stockSearch": "african family kitchen table meal"},
            {"prompt": "Hands of an older woman kneading dough on a floured wooden table, warm indoor light, no faces visible", "stockSearch": "older hands kneading dough table"},
            {"prompt": "A large extended family Sunday lunch outdoors under a tree in Zimbabwe, plates being passed, many generations present", "stockSearch": "african family gathering lunch outdoors"},
            {"prompt": "Neat vegetable beds in a Zimbabwean back garden with a few struggling rose bushes at the edge, early morning light", "stockSearch": "vegetable garden roses backyard morning"},
        ],
    },
}

james = {
    "slug": "james-peters",
    "name": "James Peters",
    "years": "1961–2019",
    "birthYear": 1961,
    "deathYear": 2019,
    "location": "Harare",
    "tagline": "The Laughing Brother, Keeper of the Family Stories",
    "pronoun": "his",
    "features": ["voiceNotes"],
    "candles": 118,
    "communityMemorial": False,
    "unlisted": True,
    "biographyTitle": "His Life",
    "biography": [
        "James Peters was born in Mutare in 1961, three years after his brother John, into a household where the rules had already been written and largely tested. He spent his childhood finding the gaps in them, and his adulthood describing those years to anyone who would sit still.",
        "He was, by every account including his own, the less serious son. Where John fixed things, James explained them, usually incorrectly and always entertainingly. Their father Samuel called them the hammer and the radio, and declined to say which was which.",
        "He trained as a radio technician in Harare in 1981 and spent his working life in broadcast engineering, first with a national station and later independently, keeping transmitters alive across the country with a toolkit, a Land Rover and an unreasonable amount of optimism. He knew the road to every relay mast in Zimbabwe and had an opinion about the tea at each one.",
        "He married Patience Muzenda in 1989. They had no children of their own, a fact he referred to publicly and often with a shrug and the line that he had four nephews and nieces and quite enough noise. He was the uncle who arrived with something inadvisable — a kite, a drum, a puppy that had not been discussed with anyone.",
        "He was the keeper of the family stories, and he took the role seriously even while telling them badly on purpose. He knew which great-aunt had refused which marriage, and why the family left the village in 1948, and what Samuel had actually said on the walk to the mission college. When Samuel died in 2001, James became the only person who still had the whole shape of it.",
        "He recorded things. Cassettes first, then a small digital recorder he carried in the Land Rover. He taped family gatherings, arguments, his mother's kitchen, his father telling the eleven miles story. He did it without explanation for thirty years, and the family regarded it as an eccentricity until 2019, when it stopped being one.",
        "He was diagnosed in early 2019 and given a period he described as inconvenient. He spent much of it labelling tapes. He wrote the family history down in a hard-backed notebook, in handwriting that deteriorated visibly across the pages, and gave it to John in Johannesburg in June, saying that a hammer should hold it since the radio was going off air.",
        "He died in Harare in September 2019, aged fifty-eight. Patience was with him. John drove up from Johannesburg and arrived four hours late, which James had predicted in writing, in the notebook, on a page his brother did not find until afterwards.",
        "He rests in the Peters Family Glen, near his parents. The notebook is with the family. The tapes are being digitised, slowly, by his nephew David.",
    ],
    "tributesTitle": "Tributes from His Family",
    "tributes": [
        "My brother wrote down that I would arrive late to his funeral. He was right. He was usually right, which was the most irritating thing about him. — John, brother",
        "He turned up with a drum for a six-year-old and left the same afternoon. I have never forgiven him and I would give anything to have him do it again. — Grace, sister-in-law",
        "Uncle James taped everything. We thought it was a joke. Now I am digitising four hundred hours of my grandparents' voices. — David, nephew",
        "He knew why the family left the village in 1948. He was the only one left who did. Then he wrote it down. — Sarah, niece",
        "Thirty years of transmitters and not one mast he could not talk back to life. Usually while telling you a story about it. — A colleague, Harare",
        "He called himself the radio and his brother the hammer. He was very pleased with that for about thirty years. — Patience, wife",
    ],
    "scripture": [
        "A cheerful heart is good medicine, but a crushed spirit dries up the bones. — Proverbs 17:22",
        "One generation shall praise thy works to another, and shall declare thy mighty acts. — Psalm 145:4",
    ],
    "hymn": {
        "original": "Ishe komborera Africa, ngaisimudzirwe zita rayo.",
        "language": "Shona",
        "translation": "Lord bless Africa, let her name be lifted high.",
    },
    "poem": {
        "title": "Forever in Our Hearts",
        "lines": [
            "You kept the tapes when no one asked you to,",
            "And labelled them in writing gone unsteady;",
            "You held the shape of everything we knew",
            "And handed it across before you left.",
            "The masts still stand along the roads you drove,",
            "The tea is just as bad at every one;",
            "You called yourself the radio, and wove",
            "The signal that still reaches us. Well done.",
        ],
        "closing": "Rest in peace, James. The tapes are safe. Keep talking.",
    },
    "favouriteSong": {
        "title": "Nzombe Huru",
        "artist": "Leonard Dembo",
        "description": "He played it in the Land Rover on every road to every relay mast in the country, at a volume that made conversation impossible, which his passengers eventually understood to be the point.",
        "youtubeSearch": "Leonard Dembo Nzombe Huru",
        "playlistNote": "Played as the family left the graveside, at Patience's request, at volume.",
    },
    "voiceNote": {
        "title": "The Last Tape — For John",
        "description": "Recorded in Harare in July 2019, two months before he died, on the digital recorder he carried in the Land Rover. He addresses his brother directly, works through the family history one more time, and gets the ending wrong on purpose.",
        "duration": "3:22",
    },
    "galleryCaption": "Family memories: the Land Rover and the road to every mast in the country, family gatherings he taped without telling anyone, and the hard-backed notebook he filled in his last months.",
    "booklets": [
        "Memorial Invitation",
        "Order of Service",
        "James Peters — Tributes Booklet",
        "James Peters — Final Booklet",
    ],
    "restingPlace": {
        "name": "Peters Family Glen, Glen Forest Memorial Park, Harare",
        "description": "He rests near Samuel and Ruth in the Peters Family Glen. His brother John chose the position, a little apart and facing the path, on the grounds that James would have wanted to see who was arriving and comment on it.",
    },
    "timeline": [
        {"year": "1961", "title": "Born in Mutare", "text": "Second son of Samuel and Ruth, three years after his brother John."},
        {"year": "1981", "title": "Trained as a radio technician", "text": "Qualified in Harare and began a working life in broadcast engineering."},
        {"year": "1989", "title": "Married Patience Muzenda", "text": "Thirty years together in Harare."},
        {"year": "2001", "title": "Became keeper of the stories", "text": "On Samuel's death he was left holding the whole shape of the family history."},
        {"year": "2019", "title": "Wrote the family history down", "text": "Filled a hard-backed notebook in his last months and gave it to John in June."},
        {"year": "2019", "title": "Laid to rest at Glen Forest", "text": "Died in Harare aged fifty-eight and was buried near his parents in the family glen."},
    ],
    "images": {
        "portrait": {
            "prompt": "Dignified portrait photograph of a Zimbabwean man in his mid fifties, warm and amused expression, open-collared shirt, soft natural light, plain background",
            "stockSearch": "african man fifties smiling portrait",
        },
        "gallery": [
            {"prompt": "An older Land Rover parked on a dirt road in rural Zimbabwe beside a tall radio transmission mast, wide sky, late afternoon", "stockSearch": "land rover dirt road transmission mast"},
            {"prompt": "A collection of old audio cassettes and a small handheld recorder on a wooden table, handwritten labels, warm lamp light", "stockSearch": "old cassette tapes recorder table"},
            {"prompt": "A hard-backed notebook open on a table filled with handwriting, reading glasses beside it, soft window light, no text legible", "stockSearch": "handwritten notebook glasses table"},
            {"prompt": "A long straight road through the Zimbabwean highveld at golden hour, grass either side, distant hills", "stockSearch": "zimbabwe highveld road golden hour"},
        ],
    },
}

data = json.loads(SRC.read_text(encoding="utf-8"))
existing = {m["slug"] for m in data}
added = []
for m in (samuel, ruth, james):
    if m["slug"] in existing:
        print(f"  skip {m['slug']} (already present)")
        continue
    data.append(m)
    added.append(m["slug"])

SRC.write_text(json.dumps(data, ensure_ascii=False, indent=2) + "\n", encoding="utf-8")
print(f"added {len(added)}: {', '.join(added)}")
print(f"total memorials now: {len(data)}")
