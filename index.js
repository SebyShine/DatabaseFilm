/**
 * Progetto JS - Database Film con OMDb API
 * 
 * ========================================
 * 🔑 COME OTTENERE LA CHIAVE API OMDb
 * ========================================
 * 
 * OMDb API è GRATUITA e molto semplice da usare, ma richiede una chiave
 * API per funzionare. Segui i passaggi qui sotto per ottenere la tua chiave.
 * 
 * PASSAGGI:
 * 1. Vai su: http://www.omdbapi.com/apikey.aspx
 * 2. Seleziona "FREE! (1,000 daily limit)"
 * 3. Compila il form con:
 *    - Email (vera, dato che vi deve arrivare la chiave)
 *    - First Name (puoi mettere il tuo nome o un nickname)
 *    - Last Name (puoi mettere il tuo cognome o un nickname)
 *    - Use ("Testing" va benissimo o "For School Project" se preferisci)
 * 4. Clicca su "Submit"
 * 5. Controlla la tua email e clicca sul link di attivazione (altrimenti la chiave non funzionerà)
 * 6. Copia la tua API Key (dalla mail) e incollala nel codice
 * 
 * NOTA: La chiave gratuita permette al massimo 1000 richieste al giorno (più che sufficienti)
 * 
 * ========================================
 * URL API:
 * http://www.omdbapi.com/?apikey={TUA_CHIAVE}&s={TERMINE_DI_RICERCA}
 * 
 * Nota la struttura della query:
 * - apikey: la tua chiave API
 * - s: termine di ricerca (es. "Matrix")
 * ========================================
 * 
 * Risposta (esempio):
 * {
 *   "Search": [
 *     { "Title": "The Matrix", "Year": "1999", "imdbID": "tt0133093", "Type": "movie", "Poster": "url" }
 *   ],
 *   "Response": "True"
 * }
 * 
 * ========================================
 * FUNZIONALITÀ DA IMPLEMENTARE:
 * ========================================
 * 
 * 1. Creare una variabile per la chiave API (dove mettere la tua chiave) e l'URL base
 * 2. Recuperare gli elementi del DOM (input ricerca, bottone, tabella, ecc.)
 * 3. Creare una funzione per cercare film dall'API OMDb (usa fetch)
 * 4. Creare una funzione per mostrare i risultati in una tabella (spezzala in più funzioni se vuoi)
 * 5. Creare una funzione per gestire i preferiti in localStorage (aggiungere i film se non sono già presenti)
 * 6. Aggiungere pulsante "Aggiungi ai Preferiti" per ogni film
 * 7. Disabilitare il pulsante se il film è già nei preferiti
 * 
 * Suggerimenti per l'implementazione:
 * - Usa fetch() per chiamare l'API con il termine di ricerca
 * - Usa data.Search per ottenere l'array di film
 * - Crea le righe della tabella dinamicamente con innerHTML o createElement
 * - Usa localStorage.setItem() e localStorage.getItem() per i preferiti
 * - Salva i preferiti come JSON: JSON.stringify() e JSON.parse()
 * - Salva almeno questi dati dei film (titolo, anno, imdbID, tipo, poster)
 * - Controlla se un film non è già nei preferiti prima di aggiungerlo (controlla usando filter e l'imdbID per identificare univocamente)
 * - Aggiungi event listener al pulsante di ricerca (e all'input se vuoi fare Enter per cercare)
 * 
 * Bonus:
 * - Gestisci il caso in cui la chiave API non è stata inserita e mostra un messaggio di errore
 * - Gestisci il caso in cui non ci sono risultati per la ricerca e mostra un messaggio "Nessun film trovato"
 */

const API_KEY = '1f78b545';
const inputRicerca = document.getElementById("searchInput");
const btnRicerca = document.getElementById("searchBtn");
const tabellaRisultati = document.getElementById("resultsSection");
const corpoTabella = document.getElementById("moviesTableBody");
const messaggioNascosto = document.getElementById("message");

// Funzione legge preferiti dal localStorage
function ottieniPreferiti() {
    return JSON.parse(localStorage.getItem('preferiti')) || [];
}

async function cercaFilm() {
    const termineRicerca = inputRicerca.value.trim();
    if (termineRicerca === "") {
        alert("Inserisci un termine di ricerca.");
        return;
    }

    // Reset stato
    messaggioNascosto.classList.add("nascosto");
    messaggioNascosto.className = "message"; // Ristabilisce la classe base ed elimina success/error passati

    try {
        const response = await fetch(`http://www.omdbapi.com/?apikey=${API_KEY}&s=${termineRicerca}`);
        const data = await response.json();
        mostraRisultati(data);
    } catch (error) {
        console.error("Errore durante la fetch:", error);
        messaggioNascosto.textContent = "Si è verificato un errore di rete.";
        messaggioNascosto.classList.add("error");
        messaggioNascosto.classList.remove("nascosto");
    }
}

function mostraRisultati(data) {
    corpoTabella.innerHTML = "";
    
    if (data.Response === "True") {
        // Nascondi messaggio d'errore precedente e mostra la tabella
        tabellaRisultati.classList.remove("nascosto");
        
        const preferitiAttuali = ottieniPreferiti();

        data.Search.forEach(film => {
            const riga = document.createElement("tr");
            
            // Verifichiamo se il film è già salvato nei preferiti
            const giaPreferito = preferitiAttuali.some(f => f.imdbID === film.imdbID);

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
                    <button class="btn btn-add" ${giaPreferito ? 'disabled' : ''}>
                        ${giaPreferito ? '★ Salvato' : '⭐ Aggiungi'}
                    </button>
                </td>
            `;

            // Evento click al bottone appena inserito
            const btnAdd = riga.querySelector(".btn-add");
            btnAdd.addEventListener("click", () => aggiungiAiPreferiti(film, btnAdd));

            corpoTabella.appendChild(riga);
        });
    } else {
        // Nascondi la tabella e mostra messaggio ERRORE dal CSS
        tabellaRisultati.classList.add("nascosto");
        messaggioNascosto.textContent = "Nessun film trovato.";
        messaggioNascosto.classList.add("error");
        messaggioNascosto.classList.remove("nascosto");
    }
}

function aggiungiAiPreferiti(film, bottone) {
    let preferiti = ottieniPreferiti();

    if (!preferiti.some(f => f.imdbID === film.imdbID)) {
        preferiti.push(film);
        localStorage.setItem('preferiti', JSON.stringify(preferiti));
        
        // Disabilitiamo subito il bottone visivamente senza dover ricaricare la pagina
        bottone.disabled = true;
        bottone.textContent = "★ Salvato";
    }
}

// Event Listener - ENTER
btnRicerca.addEventListener("click", cercaFilm);
inputRicerca.addEventListener("keypress", (e) => {
    if (e.key === "Enter") cercaFilm();
});