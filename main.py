"""
Launch the Tic-Tac-Toe game in the default web browser.
"""

from functools import partial
from http.server import SimpleHTTPRequestHandler, ThreadingHTTPServer
from pathlib import Path
import webbrowser


def launch() -> None:
    project_dir = Path(__file__).parent
    game_file = project_dir / "index.html"

    if not game_file.exists():
        print("Error: index.html not found. Make sure it is in the same folder as main.py.")
        return

    # Serves the project locally so JavaScript modules work in all browsers.
    handler = partial(SimpleHTTPRequestHandler, directory=str(project_dir))

    with ThreadingHTTPServer(("127.0.0.1", 0), handler) as server:
        url = f"http://127.0.0.1:{server.server_port}/index.html"

        print(f"Launching Tic-Tac-Toe at {url}")
        print("Press Ctrl+C here when you are finished playing.")

        webbrowser.open(url)

        try:
            server.serve_forever()
        except KeyboardInterrupt:
            print("\nTic-Tac-Toe server stopped.")


if __name__ == "__main__":
    launch()