default:
	make clean
	node index.js

clean:
	rm -rf out
	mkdir out
	mkdir out/spells
	mkdir out/creatures
	mkdir out/items
	mkdir out/monsters
