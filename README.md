# UAAD / Our Footprints

## Install
Copy the contents of this folder into your existing website root (beside shared.css, shared.js and program-item.html). Replace index.html and programs.json. Add footprints.css, footprints.js, venues.json and the vendor folder. Keep your existing images, videos, shared files, program.html and program-item.html. No build step or API key is required. Deploy with your existing GitHub Pages branch, or preview via a local HTTP server.

This package is an update, not a complete website. Your shared.css/shared.js and media were not supplied and are intentionally not recreated. Do not replace the whole repository with this folder.

## Behavior
- Our Footprints replaces the homepage timeline; the other sections and their interactions are retained.
- Same section padding as before: 4vw desktop, 20px mobile; same 1500px maximum width as the previous preview card.
- NYC opens first. Hover/focus previews a project, click locks selection; click empty map or Escape unlocks it.
- Repeated venues show stacked circles; clicking expands individual project markers joined to their original location.
- World shows city totals at small scales; clicking a city zooms to its venues. Supplied physical projects are all NYC, so only NYC appears. No invented international projects.
- Online shows nine online/virtual programs, including the Parsons talk whose original section is IRL but whose venue says Virtual. Original section values remain intact for the archive.
- Read more opens program-item.html?slug=... . Previous/Next follow newest-to-oldest date order within the selected mode, including venues outside the current viewport. Controls stop at the ends.
- Desktop panel scrolls independently. Mobile stacks the preview beneath the map to leave the page scroll accessible. Drag/pinch or use +/-; wheel scroll continues down the homepage.
- Current project introduction text is used, with description as fallback. Optional mapIntroduction overrides only the map preview. Existing paragraphs are preserved. Long research content has not been invented.

## Updating data
programs.json keeps all 26 supplied projects, including publications, and adds:
- footprintNumber: stable unique project number; keep assigned numbers unchanged. New programs get a new unique number.
- venueId: matches a venue in venues.json for a physical project.
- mapMode: physical or online.
Publications are excluded from the map. showOnHome:false hides a project from all map modes.

For a new physical venue add id, name, address, city, country, coordinates:[latitude,longitude] and optional aliases to venues.json. Use the same venueId on the program. Unmatched physical projects remain accessible below the map, with a console-free fallback rather than an invented location.

IMPORTANT: The 12 initial venue coordinates are approximate placements based on their addresses, not surveyed/geocoded coordinates. Verify in particular the historical locations for Between Space, FLORA HQ, Sojourner and NYU Tandon @ The Yard against the actual event locations before publishing. Current venue addresses may differ from the address at the event date. Each venue is marked coordinatePrecision:approximate for review.

## Dependencies
Leaflet 1.9.4 JS and CSS are bundled locally (license in vendor/LEAFLET-LICENSE.txt). Map imagery is requested from CARTO; OpenStreetMap and CARTO attribution is retained. An internet connection is required for the basemap. Project nodes and cards remain usable if tiles fail. No API secret belongs in these files.

## Validation
JavaScript syntax and real Leaflet DOM integration checked: initial project, all 12 venue markers, same-venue expansion, previous/next, internal project links, nine online nodes, mode switching. Existing project content preserved aside from new map metadata.
Full graphical browser/mobile rendering was not verified: the execution environment blocked browser startup. Check the deployed preview on desktop, Safari and mobile before replacing the live version. The uploaded files did not include shared.css/shared.js, so final styling must also be reviewed alongside those existing files.
