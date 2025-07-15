let currentLanguage = 'roman';  // default language
let chapters = {};              // to store grouped data for re-rendering

document.addEventListener('DOMContentLoaded', () => {
    const chapterLinksDiv = document.getElementById('chapter-links');
    const chapterDisplayDiv = document.getElementById('chapter-display');

    fetch('chapters')
        .then(response => response.json())
        .then(data => {
            // Group verses by chapter
            data.forEach(verse => {
                const chapterId = verse.chapter_id;
                if (!chapters[chapterId]) {
                    chapters[chapterId] = {
                        title: `Chapter ${verse.chapter_number}`,
                        verses: []
                    };
                }
                chapters[chapterId].verses.push(verse);
            });

            // Create chapter links
            for (const chapterId in chapters) {
                const chapter = chapters[chapterId];
                const link = document.createElement('a');
                link.href = `#`;
                link.textContent = chapter.title;
                link.style.cursor = 'pointer';
                link.dataset.chapterId = chapterId;

                link.addEventListener('click', (e) => {
                    e.preventDefault();

                    // Mark selected for re-rendering on language change
                    document.querySelectorAll('.chapter-list a').forEach(el => el.classList.remove('selected'));
                    link.classList.add('selected');

                    displayChapter(chapter.verses, chapterDisplayDiv);
                });

                chapterLinksDiv.appendChild(link);
            }

            // ✅ Handle language dropdown
            const languageSelect = document.getElementById('language-select');
            if (languageSelect) {
                languageSelect.addEventListener('change', function () {
                    currentLanguage = this.value;

                    // If a chapter is already selected, re-render it
                    const selected = document.querySelector('.chapter-list a.selected');
                    if (selected) {
                        const chapterId = selected.dataset.chapterId;
                        displayChapter(chapters[chapterId].verses, chapterDisplayDiv);
                    }
                });
            }
        })
        .catch(error => console.error('Error fetching or parsing JSON:', error));
});


function transliterateWordMeanings(inputText) {
    if (!inputText) return "";

    const entries = inputText.split(";").map(e => e.trim()).filter(e => e);

    const result = entries.map(pair => {
        if (!pair.includes("—")) return "";

        const [roman, meaning] = pair.split("—").map(s => s.trim());
        const devnagari = Sanscript.t(roman, "iast", "devanagari");

        if (currentLanguage === 'roman') {
            return `<strong>${roman}</strong> — ${meaning}`;
        } else {
            return `<strong>${devnagari}</strong> — ${meaning}`;
        }
    });

    return result.join("; ");
}



function displayChapter(verses, container) {
    container.innerHTML = ''; // Clear previous content

    // ✅ Show Chapter Title
    const chapterTitle = document.createElement('h2');
    chapterTitle.textContent = `Chapter ${verses[0].chapter_number}`;
    chapterTitle.style.marginBottom = '15px';
    container.appendChild(chapterTitle);

    // Sort verses
    verses.sort((a, b) => a.verse_order - b.verse_order);

    verses.forEach((verse) => {
        const verseDiv = document.createElement('div');
        verseDiv.classList.add('verse');

        const verseTitle = document.createElement('div');
        verseTitle.classList.add('verse-title');
        verseTitle.textContent = `Verse ${verse.verse_number}`;
        verseDiv.appendChild(verseTitle);

        const originalText = document.createElement('p');
        originalText.innerHTML = verse.text.replace(/\n/g, '<br>');
        verseDiv.appendChild(originalText);

        const wordMeanings = document.createElement('p');
        const transliterated = transliterateWordMeanings(verse.word_meanings);
        wordMeanings.innerHTML = `<span style="font-weight: bold; color: black;">Word Meanings:</span> ${transliterated}`;
        wordMeanings.classList.add('word-meanings');
        verseDiv.appendChild(wordMeanings);

        container.appendChild(verseDiv);
    });
}
function romanToDev(input) {
    if (!input) return "";
    return Sanscript.t(input, "iast", "devanagari");
}
