# Humanoid: Fall Flat

Local gallery for one shared event computer. No Cloudflare setup, server backend, npm installation or synced database. All votes are unlimited and local to the browser.

## Run in VS Code

Open this folder in VS Code. Use the Live Server extension and open `index.html` with **Open with Live Server**. Or run:

```sh
python3 -m http.server 8000
```

Then open `http://localhost:8000`. Use the same browser and exact address throughout the event: `localhost` and `127.0.0.1`, and different ports, use separate browser storage. Use a regular browser window. Refreshing or reopening the same address keeps the stored works and counts, unless browser data is cleared.

No files have been published. This package replaces the earlier Cloudflare-based version for your local use.

## Add works without code

Click **Manage archive** at the top left to open the separate `admin.html` page. Choose or drop an image, video or audio file, then select a category and tags. Title and description are optional. Blank titles default to the filename. Artist name and URL appear for Artistic Responses; Source URL and credit appear for Robotic Failures. Add an optional cover and save. Click Save work. File uploads persist in browser file storage on this computer. Very large uploads can hit browser storage limits. The source files on your disk are not moved or modified. Edit entries, Hide/Show them, or Delete them using the Works list. Hidden works retain their votes and are excluded from the gallery and leaderboard. Changes are reflected in another open gallery tab on the same localhost address.

The manager is not password protected because this is a single-computer local tool. If you later publish this version, everyone will have their own local content and vote counts. It is not a public shared poll.

Choose exactly one category:

- Robotic Failures
- Artistic Responses

You can also place files in `media/` and enter a relative path like `media/artist-title.mp4`. Direct URLs work too. YouTube watch links, youtu.be links and numeric Vimeo links embed in the work view; they need internet. SoundCloud/Bandcamp page links are not automatically embedded. For offline use, use uploaded files or files in `media/`, in browser-playable formats. MP4/H.264 and MP3 are practical choices, but playback depends on your browser and codec.

## Edit works as code

`works.json` starts empty. Add an array of records, for example:

```json
[
  {
    "id": "artist-work-title",
    "title": "Work title",
    "artist": "Artist name",
    "category": "Artistic Responses",
    "type": "Video",
    "src": "media/artist-work-title.mp4",
    "cover": "media/artist-work-title-cover.jpg",
    "artistUrl": "https://example.com",
    "tags": "malfunction, repetition",
    "description": "An optional description."
  }
]
```

Media types: Image, Video, Sound. Keep IDs unique and stable so vote counts stay attached to the same work. Once you save or import content through Manage archive, the browser copy takes precedence over `works.json`. To replace that copy with your revised JSON, use **Import archive backup** and select your `works.json`. Importing replaces the content list but retains votes by ID.

## Voting and backups

Click a gallery block to center it and open its details. Click **Vote for this work** to add a vote. Click again for another vote. Votes save in localStorage only after a successful write. Counts update immediately. The category filters rearrange matching works; All restores a scattered layout. Drag or scroll to move, and use zoom buttons or Ctrl/Cmd + trackpad gesture to zoom.

Manage archive includes:

- **Export vote counts**: CSV file, sorted by votes.
- **Reset all votes**: confirmation required; counts reset to zero.
- **Export archive**: JSON backup containing details and uploaded files. Files referenced by URL or `media/` path remain references and must be copied separately.
- **Import archive backup**: restore that content on another browser/computer. Votes are separate and are not imported.

Export content after preparing the archive, and export vote counts before resetting or clearing browser data. Browser storage is not a substitute for your original files. Removing a work does not delete its stored media or votes; this allows re-importing the same work ID. Uploaded media not used by any work is not included in the export. Exporting large videos uses additional browser memory.

For a visual test with six clearly labeled samples, open `http://localhost:8000/?demo=1`. Demo content and votes use separate storage and do not affect your real event archive.

## Files

- `index.html`: public gallery
- `admin.html`: separate local upload and management page
- `styles.css`: appearance and responsive layouts
- `gallery.js`: gallery, uploads, backups and local voting
- `works.json`: optional initial content
- `media/`: local media and sample SVGs
- `tests/gallery.test.cjs`: focused voting and layout checks

Optional checks, if Node.js is installed:

```sh
node --check gallery.js
node --test tests/gallery.test.cjs
```

Vote persistence and layouts have been tested in code. Browser UI and playback should be checked on the event computer with your actual files before the event.

## Gallery playback

The manager preview panel has been removed. Uploaded videos play automatically, muted and looping in gallery blocks. Covers are optional: without one, the video element shows its first decoded frame while loading or if the browser refuses autoplay. GIF images animate directly. Hidden or off-screen gallery videos pause; they resume when visible. Opening a work pauses background videos; the centered player has controls for sound and playback. External service embeds retain their provider behavior.
