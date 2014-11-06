NAME = chromesoul
VERSION = $(shell cat manifest.json | /bin/grep '"version"' | cut -d '"' -f 4)
SRC = background.js \
      chromesoul.css \
      chromesoul.html \
      chromesoul.js \
      CREDITS.md \icon_128.png \
      icon_16.png \
      img \
      lib \
      LICENCE.txt \
      manifest.json \
      README.md \
      third-party
PUBDIR = publish
ARCHIVE = $(PUBDIR)/chromesoul_$(VERSION).zip

all:
	zip -r $(ARCHIVE) $(SRC)
	rm -f $(PUBDIR)/chromesoul.zip
	ln -s $(ARCHIVE) $(PUBDIR)/chromesoul.zip
