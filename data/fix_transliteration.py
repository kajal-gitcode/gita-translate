import json
from indic_transliteration.sanscript import transliterate, DEVANAGARI, IAST

def correct_transliteration(json_file):
    with open(json_file, 'r', encoding='utf-8') as f:
        verses = json.load(f)

    for verse in verses:
        # Step 1: Clean Hindi text (remove extra line breaks and verse number symbols)
        hindi_text = verse["text"].replace("\n", " ").strip()
        hindi_text_clean = ' '.join(word for word in hindi_text.split() if "।" not in word)

        # Step 2: Transliterate to IAST Roman
        correct_roman = transliterate(hindi_text_clean, DEVANAGARI, IAST)

        # Step 3: Update transliteration field
        verse["transliteration"] = correct_roman

    # Step 4: Save to new JSON file
    with open("corrected_verse.json", 'w', encoding='utf-8') as f:
        json.dump(verses, f, indent=2, ensure_ascii=False)

    print("✅ Transliteration corrected! Output saved to corrected_verse.json")


# CALL the function — pass your original file name
correct_transliteration("verse.json")
