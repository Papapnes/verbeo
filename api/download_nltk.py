import os
import nltk
target = os.path.join(os.path.dirname(__file__), "nltk_data")
os.makedirs(target, exist_ok=True)
for package in ("wordnet", "omw-1.4"):
    nltk.download(package, download_dir=target, raise_on_error=True)
