// @ts-check
/* global localize */
import { $DialogWindow } from "./$ToolWindow.js";
// import { localize } from "./app-localization.js";
import { E, is_discord_embed } from "./helpers.js";
import { showMessageBox } from "./msgbox.js";

/** @type {OSGUI$Window & I$DialogWindow} */
let $storage_manager;
let $quota_exceeded_window;
let ignoring_quota_exceeded = false;

async function storage_quota_exceeded() {
	if ($quota_exceeded_window) {
		$quota_exceeded_window.close();
		$quota_exceeded_window = null;
	}
	if (ignoring_quota_exceeded) {
		return;
	}
	const { promise, $window } = showMessageBox({
		title: "Errore di archiviazione",
		messageHTML: `
			<p>JS Paint normalmente conserva un backup locale delle immagini che modifichi.</p>
			<p>Tuttavia, lo spazio per farlo è esaurito.</p>
			<p>Puoi ancora salvare l'immagine corrente con <b>File > Salva</b>. Dovresti salvare frequentemente o liberare spazio per i backup.</p>
		`,
		buttons: [
			{ label: "Manage Storage", value: "manage", default: true },
			{ label: "Ignore", value: "ignore" },
		],
		iconID: "warning",
	});
	$quota_exceeded_window = $window;
	const result = await promise;
	if (result === "ignore") {
		ignoring_quota_exceeded = true;
	} else if (result === "manage") {
		ignoring_quota_exceeded = false;
		manage_storage();
	}
}

function manage_storage() {
	if ($storage_manager) {
		$storage_manager.close();
	}
	$storage_manager = $DialogWindow();
	$storage_manager.title("Gestisci archiviazione").addClass("storage-manager squish");
	// @TODO: way to remove all (with confirmation)
	const $table = $(E("table")).appendTo($storage_manager.$main);
	const $message = $(E("p")).appendTo($storage_manager.$main).html(
		"Tutte le immagini che hai salvato sul tuo computer con <b>File > Salva</b> non sarà influenzato."
	);
	const $close = $storage_manager.$Button("Chiudi", () => {
		$storage_manager.close();
	});

	const addRow = (k, imgSrc) => {
		const $tr = $(E("tr")).appendTo($table);

		const $img = $(E("img")).attr({ src: imgSrc }).addClass("thumbnail-img");
		const $remove = $(E("button")).text("Rimuovi").addClass("remove-button").attr("type", "button");
		const href = `#${k.replace("image#", "local:")}`;
		// The Electron app is a single window for now. This isn't a great experience, but it's better than a broken link.
		// The Discord Activity can open a external links (with a prompt), but opening internally seems better,
		// and it was opening a new tab with the app but not loading the document, so this fixes that.
		// (It seemed to be a separate storage area, despite the same origin? only glancing, not sure.)
		const target = window.is_electron_app || is_discord_embed ? "_self" : "_blank";
		const $open_link = $(E("a")).attr({ href, target }).text(localize("Apri"));
		const $thumbnail_open_link = $(E("a")).attr({ href, target }).addClass("thumbnail-container");
		$thumbnail_open_link.append($img);
		$(E("td")).append($thumbnail_open_link).appendTo($tr);
		$(E("td")).append($open_link).appendTo($tr);
		$(E("td")).append($remove).appendTo($tr);

		$remove.on("click", () => {
			// Focus the next or previous row's remove button, or the close button if there are no more rows.
			// Try focusing controls in reverse order of priority, so the highest priority control gets focus.
			$close.focus();
			$tr.prev().find(".remove-button").focus();
			$tr.next().find(".remove-button").focus();

			localStorage.removeItem(k);
			$tr.remove();
			if ($table.find("tr").length == 0) {
				$message.html("<p>Tutto pulito!</p>");
			}
		});
	};

	let localStorageAvailable = false;
	try {
		if (localStorage.length > 0) {
			// This is needed in case it's COMPLETELY full.
			// Test with https://stackoverflow.com/questions/45760110/how-to-fill-javascript-localstorage-to-its-max-capacity-quickly
			// Of course, this dialog only manages images, not other data (for now anyway).
			localStorageAvailable = true;
		} else {
			localStorage._available = true;
			localStorageAvailable = localStorage._available;
			delete localStorage._available;
		}
	} catch (_error) { /* ignore */ }

	if (localStorageAvailable) {
		for (const k in localStorage) {
			if (k.match(/^image#/)) {
				let v = localStorage[k];
				try {
					if (v[0] === '"') {
						v = JSON.parse(v);
					}
				} catch (_error) { /* ignore */ }
				addRow(k, v);
			}
		}
	}

	if (!localStorageAvailable) {
		// @TODO: DRY with similar message
		// @TODO: instructions for your browser; it's called Cookies in chrome/chromium at least, and "storage" gives NO results
		$message.html("<p>Abilita l'archiviazione locale nelle impostazioni del tuo browser per il backup locale. Potrebbe chiamarsi Cookie, Archiviazione o Dati del sito..</p>");
	} else if ($table.find("tr").length == 0) {
		$message.html("<p>Tutto pulito!</p>");
	}

	$storage_manager.$content.width(450);
	$storage_manager.center();

	$storage_manager.find(".remove-button").focus();
}

export {
	manage_storage, storage_quota_exceeded
};

