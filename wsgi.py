from www.app import app as application
from pathlib import Path

if __name__ == "__main__":
	application.run()
	# touch /tmp/app-initialized
	Path('/tmp/app-initialized').touch()
	