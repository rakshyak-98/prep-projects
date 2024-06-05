module.exports = class {
	constructor(size) {
		this.requested = new Array(size).fill(false);
        this.received = new Array(size).fill(false);
	}

	addRequest(pieceIndex) {
		this.requested[pieceIndex] = true;
	}

	addReceive(pieceIndex) {
		this.received[pieceIndex] = true;
	}

    isNeeded(pieceIndex){
        if(this.requested.every(i => i === true)){
            this.requested = this.received.slice();
        }
        return !this.requested[pieceIndex];
    }

	idDone() {
		return this.received.every((i) => i === true);
	}
};

