class Cryptex {
    constructor(parentDiv, nRings, goodAnswer, callback) {
        this.parentDiv = parentDiv;
        this.parentDiv.className = 'cryptex';
        this.nRings = nRings;
        this.answer = [];
        this.goodAnswer = goodAnswer;
        this.callback = callback;

        this.createCryptex();
    }

    createCryptex() {
        let link = document.createElement('link');
        link.rel = 'stylesheet';
        link.href = 'https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.5.2/css/all.min.css';
        link.integrity = 'sha512-SnH5WK+bZxgPHs44uWIX+LLJAJ9/2PkPKZ5QiAj6Ta86w+fsb2TkcmfRyVX3pBnMFcV7oQPJkl9QevSCWr3W6A==';
        link.crossOrigin = 'anonymous';
        link.referrerPolicy = 'no-referrer';
        document.head.appendChild(link);

        for (let i = 0; i < this.nRings; i++) {
            const ring = document.createElement('div');
            ring.className = 'ring';
            ring.id = 'ring' + i;

            const upButton = document.createElement('div');
            upButton.className = 'cryptexButton';
            upButton.id = 'upButton' + i;
            upButton.onclick = () => this.handleClick(i, 'up');
            const upIcon = document.createElement('i');
            upIcon.className = 'fa-solid fa-caret-up';
            upButton.appendChild(upIcon);
            ring.appendChild(upButton);

            const ringInner = document.createElement('div');
            ringInner.className = 'ringInner';
            ringInner.id = 'ringInner' + i;
            ring.appendChild(ringInner);
            ringInner.innerHTML = 0;

            const downButton = document.createElement('div');
            downButton.className = 'cryptexButton';
            downButton.id = 'downButton' + i;
            downButton.onclick = () => this.handleClick(i, 'down');
            const downIcon = document.createElement('i');
            downIcon.className = 'fa-solid fa-caret-down';
            downButton.appendChild(downIcon);
            ring.appendChild(downButton);

            this.answer[i] = 0;

            this.parentDiv.appendChild(ring);
        }

        const styles = `
                .cryptex {
                    display: flex;
                    flex-direction: row;
                    gap: 10px;
                    margin: 10px;
                }
                
                .ring {
                  display:flex;
                  flex-direction: column;
                  justify-content: center;
                  align-items: center;
                }
            
                .cryptexButton{
                  font-size: 4rem;
                  color: black;
                  margin: 2px;
                  transition: all 100ms;
                }
            
                .cryptexButton:hover{
                  transform: scale(1.3);
                }
            
                .cryptexButton:active{
                  transform: scale(1.5);
                  color:lightblue;
                }`;
        const styleSheet = document.createElement("style");
        styleSheet.innerText = styles;
        document.head.appendChild(styleSheet);
    }

    handleClick(n, dir){
        const e = document.getElementById('ringInner' + n);
        this.answer[n] = this.answer[n] + (dir === "up" ? 1:-1);
        e.innerHTML = this.answer[n];
        this.checkAnswer();
    }

    checkAnswer(){
        for (let i = 0; i < this.nRings; i++) {
            if (this.answer[i] !== this.goodAnswer[i]){
                return false;
            }
        }
        this.callback();
        return true;
    }

    destroy(){
        this.parentDiv.innerHTML = '';
    }
}