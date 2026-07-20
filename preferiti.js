/**
 * Pagina Preferiti - Gestione dei Film Preferiti
 * 
 * FUNZIONALITÀ DA IMPLEMENTARE:
 * 1. Caricare i film preferiti da localStorage
 * 2. Mostrare i film in una tabella con poster, titolo, anno, tipo
 * 3. Aggiungere un pulsante "Rimuovi" per ogni film
 * 4. Gestire lo stato vuoto (mostrare un messaggio quando non ci sono preferiti)
 * 
 * Suggerimenti per l'implementazione:
 * - Recupera gli elementi del DOM (tabella, corpo tabella, messaggio)
 * - Crea una funzione per recuperare i preferiti da localStorage (chiave: 'preferiti')
 * - Crea una funzione per salvare i preferiti in localStorage
 * - Crea una funzione per caricare i preferiti dal localStorage
 * - Crea una funzione per visualizzare tutta la tabella dei preferiti (usa un ciclo per creare le righe della tabella)
 * - Crea una funzione per rimuovere un film dai preferiti e aggiornare la visualizzazione (usa array.splice con l'indice dell'elemento da rimuovere)
 * - Al caricamento della pagina, chiama la funzione per mostrare i preferiti
 * - Se non ci sono preferiti, mostra un messaggio del tipo "Nessun film nei preferiti. Vai alla ricerca!"
 * 
 * Bonus:
 * - Mostra il numero totale di film preferiti
 * - Aggiungi un pulsante "Rimuovi Tutti" per svuotare la lista dei preferiti
 */



// Esempio di caricamento dei preferiti da localStorage e visualizzazione nella tabella
// caricaPreferiti();
// mostraPreferiti();
const sezionePreferiti = document.getElementById("favoritesSection");
const corpoTabellaPreferiti = document.getElementById("favoritesTableBody");
const messaggioPreferiti = document.getElementById("message");

// Legge la lista dei preferiti dal localStorage
function ottieniPreferiti() {
    return JSON.parse(localStorage.getItem('preferiti')) || [];
}

// Salva la lista dei preferiti nel localStorage
function salvaPreferiti(nuoviPreferiti) {
    localStorage.setItem('preferiti', JSON.stringify(nuoviPreferiti));
}

// Funzione principale che si occupa di renderizzare la pagina
function mostraPreferiti() {
    const preferiti = ottieniPreferiti();
    corpoTabellaPreferiti.innerHTML = "";

    // Ripristina le classi base del messaggio
    messaggioPreferiti.className = "message nascosto";

    if (preferiti.length === 0) {
        // Se non ci sono preferiti, nascondiamo la tabella e mostriamo l'info message
        sezionePreferiti.classList.add("nascosto");
        messaggioPreferiti.textContent = "Nessun film nei preferiti. Torna alla pagina di ricerca per aggiungerne qualcuno!";
        messaggioPreferiti.classList.add("info");
        messaggioPreferiti.classList.remove("nascosto");
    } else {
        // cicla elementi dentro la tabella
        sezionePreferiti.classList.remove("nascosto");

        preferiti.forEach((film, index) => {
            const riga = document.createElement("tr");

            riga.innerHTML = `
                <td>
                    <img src="${film.Poster !== "N/A" ? film.Poster : 'placeholder.jpg'}" 
                         alt="${film.Title}" 
                         class="movie-poster">
                </td>
                <td><strong>${film.Title}</strong></td>
                <td>${film.Year}</td>
                <td>${film.Type}</td>
                <td>
                    <button class="btn btn-remove">❌ Rimuovi</button>
                </td>
            `;

            // Bottone Rimuovi usa indice elemento array
            const btnRemove = riga.querySelector(".btn-remove");
            btnRemove.addEventListener("click", () => rimuoviDaiPreferiti(index));

            corpoTabellaPreferiti.appendChild(riga);
        });
    }
}

// Rimuove singolo elemento dell'array (splice)
function rimuoviDaiPreferiti(index) {
    let preferiti = ottieniPreferiti();
    preferiti.splice(index, 1); // Rimuove 1 elemento alla posizione indicata
    salvaPreferiti(preferiti);
    mostraPreferiti(); // Refresh
}

// Esegui rendering automatico
document.addEventListener("DOMContentLoaded", mostraPreferiti);