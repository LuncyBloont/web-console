class ConsoleForUser {
    constructor(ps1, endl, space, blink) {
        this.ps1 = ps1 || ">> ";
        this.endl = endl || "<br />";
        this.blink = blink || 500;
        this.space = space || "&nbsp;";
        this.history = "Hello! jser." + this.endl;
        this.history_cmd = [""];
        this.history_index = 0;
        this.message = "";
        this.editing = "";
        this.cursor = 0;
        this.cursor_char = '_';
        this.shift_mode = false;
        this.help_string = "help\n  JS Console\n  By Yuanivr\n  Undefined running\n";

        this.K_BACKSPACE = 8;
        this.K_ENTER = 13;
        this.K_SHIFT = 16;
        this.K_TAB = 9;
        this.K_LEFT = 37;
        this.K_UP = 38;
        this.K_RIGHT = 39;
        this.K_DOWN = 40;
        this.K_DELTE = 46;
        this.K_SPACE = 32;

        this.number_shift = ')!@#$%^&*(';
        this.sign_start = 186;
        this.sign = ";=,-./`??????????????????????????[\\]'";
        this.sign_shift = ":+<_>?~??????????????????????????{|}\"";

    }

    out(s) {
        this.message = s;
    }

    help() {
        var s = this.help_string;
        s = s.replace(/[ ]/g, this.space);
        s = s.replace(/\n/g, this.endl) + this.endl;
        
        this.out(s);
    }

    input(code) {
        if (this.cursor < 0 || this.cursor > this.editing.length) {
            this.cursor = this.editing.length;
        }
        window.cmcmcmc_blink = true;
        switch (code) {
            case this.K_TAB:
                this.help();
                break;

            case this.K_ENTER:
                this.enter();
                break;

            case this.K_LEFT:
                this.cursor -= this.cursor > 0 ? 1 : 0;
                break;

            case this.K_RIGHT:
                this.cursor += this.cursor < this.editing.length ? 1 : 0;
                break;

            case this.K_UP:
                if (this.history_index > 0) {
                    this.history_index -= 1;
                    this.editing = this.history_cmd[this.history_index];
                    this.cursor = this.editing.length;
                }
                break;

            case this.K_DOWN:
                if (this.history_index < this.history_cmd.length - 1) {
                    this.history_index += 1;
                    this.editing = this.history_cmd[this.history_index];
                    this.cursor = this.editing.length;
                }
                break;

            case this.K_BACKSPACE:
                this.editing = (this.cursor > 0 ? this.editing.substring(0, this.cursor - 1) : "")
                    + this.editing.substring(this.cursor, this.editing.length);
                this.cursor -= this.cursor > 0 ? 1 : 0;
                break;

            case this.K_DELTE:
                this.editing = this.editing.substring(0, this.cursor)
                    + (this.editing.length > this.cursor ?
                    this.editing.substring(this.cursor + 1, this.editing.length)
                    : "");
                break;
            
            case this.K_SHIFT:
                break;

            default:
                var chr = "";
                if (code >= 'a'.charCodeAt() && code <= 'z'.charCodeAt()) {
                    chr = String.fromCharCode(code + (!this.shift_mode ? 'A'.charCodeAt() - 'a'.charCodeAt() : 0));
                } else if (code >= 'A'.charCodeAt() && code <= 'Z'.charCodeAt()) {
                    chr = String.fromCharCode(code - (!this.shift_mode ? 'A'.charCodeAt() - 'a'.charCodeAt() : 0));
                } else if (code >= '0'.charCodeAt() && code <= '9'.charCodeAt()) {
                    chr = !this.shift_mode ? String.fromCharCode(code) : this.number_shift.charAt(code - '0'.charCodeAt());
                } else if (code == this.K_SPACE) {
                    chr = " ";
                } else {
                    chr = !this.shift_mode ? this.sign.charAt(code - this.sign_start) : this.sign_shift.charAt(code - this.sign_start);
                    this.out(code);
                }
                this.editing = this.editing.substring(0, this.cursor) + chr
                    + this.editing.substring(this.cursor, this.editing.length);
                this.cursor += 1;
        }
    }

    run(cmd) {
        if (cmd == "help") {
            this.help();
            return "";
        }
        if (cmd == "exit") {
            this.out("web page cant quit...");
            return "";
        }
        this.out("(?)");
        return cmd + "... can't run as undefined action" + this.endl;
    }

    enter() {
        var runable = false;
        if (this.editing != "") {
            runable = true;
            this.history_cmd[this.history_cmd.length] = this.editing;
            this.history_index = this.history_cmd.length;
        } else {
            this.out("");
        }
        this.history += this.ps1 + this.editing + this.endl + (runable ? this.run(this.editing) : "");
        this.editing = "";
    }

    toShow() {
        var s = this.history + this.ps1;
        if (this.cursor == this.editing.length) {
            s += this.editing + (window.cmcmcmc_blink ? this.cursor_char: " ");
        } else if (window.cmcmcmc_blink) {
            s += this.editing.substring(0, this.cursor) + this.cursor_char + this.editing.substring(this.cursor + 1, this.editing.length);
        } else {
            s += this.editing;
        }
        return s + this.endl +  this.message;
    }

    update_blink() {
        window.cmcmcmc_blink = !window.cmcmcmc_blink;
    }

    start() {
        setInterval(this.update_blink, this.blink);
    }

    shift_test_down(code) {
        if (code == this.K_SHIFT) {
            this.shift_mode = true;
        }
    }

    shift_test_up(code) {
        if (code == this.K_SHIFT) {
            this.shift_mode = false;
        }
    }
}