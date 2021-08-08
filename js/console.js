var bin = new Object();
bin.help = function(cf) {
    cf.print(cf.help());
    return true;
};
bin.clear = function(cf) {
    cf.history = "";
    return true;
};
bin.exit = function(cf) {
    cf.print("web page cant quit...");
    return true;
};

class ConsoleForUser {
    constructor(keyFunc, ps1, endl, space, blink) {
        /*
        ps1: the shell's variable PS1, show at the start of the line user inputting.
        endl: the line break string. '\n' for textarea; '<br />' for div.
        space: the space string. ' ' for textarea; '&nbsp;' for div.
        blink: the time between cursor blinks.
        */
        this.ps1 = ps1 || ">> ";
        this.endl = endl || "<br />";
        this.blink = blink || 500;
        this.space = space || "&ensp;";

        this.scode = ["&lt;", "&gt;"];
        this.max_history = 10000;
        this.max_history_cmd = 20;

        this.history = "Hello! jser. input \"help\" to show more help." + this.endl; // whole history message. 
        this.history_cmd = [""]; // commands history
        this.history_index = 0; // the index of commands history when choosing them.
        this.message = ""; // message shown under cursor.
        this.editing = ""; // the typing command.
        this.cursor = 0; // the cursor position.
        this.cursor_char = '_';
        this.shift_mode = false; // is shift down
		this.keyFunc = keyFunc;

        // Override{
        this.help_string = "help\n  JS Console\n  By LuncyBloont\n  Undefined running\n\
basic command:\n\
  clear        \tclean the console.\n\
  help         \tshow help doc.\n";
        // }

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
        s = this.getString(s) + this.endl;
        return s;
    }

    input(code, event) {
        if (this.cursor < 0 || this.cursor > this.editing.length) {
            this.cursor = this.editing.length;
        }
        window.cmcmcmc_blink = true;
        switch (code) {
            case this.K_TAB:
                event.preventDefault();
                this.print(this.help());
				this.keyFunc();
                break;

            case this.K_ENTER:
                event.preventDefault();
                this.enter();
				this.keyFunc();
                break;

            case this.K_LEFT:
                event.preventDefault();
                this.cursor -= this.cursor > 0 ? 1 : 0;
				this.keyFunc();
                break;

            case this.K_RIGHT:
                event.preventDefault();
                this.cursor += this.cursor < this.editing.length ? 1 : 0;
				this.keyFunc();
                break;

            case this.K_UP:
                event.preventDefault();
                if (this.history_index > 0) {
                    this.history_index -= 1;
                    this.editing = this.history_cmd[this.history_index];
                    this.cursor = this.editing.length;
                }
				this.keyFunc();
                break;

            case this.K_DOWN:
                event.preventDefault();
                if (this.history_index < this.history_cmd.length - 1) {
                    this.history_index += 1;
                    this.editing = this.history_cmd[this.history_index];
                    this.cursor = this.editing.length;
                }
				this.keyFunc();
                break;

            case this.K_BACKSPACE:
                event.preventDefault();
                this.editing = (this.cursor > 0 ? this.editing.substring(0, this.cursor - 1) : "")
                    + this.editing.substring(this.cursor, this.editing.length);
                this.cursor -= this.cursor > 0 ? 1 : 0;
				this.keyFunc();
                break;

            case this.K_DELTE:
                event.preventDefault();
                this.editing = this.editing.substring(0, this.cursor)
                    + (this.editing.length > this.cursor ?
                    this.editing.substring(this.cursor + 1, this.editing.length)
                    : "");
				this.keyFunc();
                break;
            
            case this.K_SHIFT:
                break;

            /*default:
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
                    // this.out(code);
                }
                this.editing = this.editing.substring(0, this.cursor) + chr
                    + this.editing.substring(this.cursor, this.editing.length);
                this.cursor += 1;*/
        }
		
    }

    get_in(s) {
        var chr = s;
        this.editing = this.editing.substring(0, this.cursor) + chr
            + this.editing.substring(this.cursor, this.editing.length);
        this.cursor += chr.length;
		if (chr != '') this.keyFunc();
    }

    print(s, noendl) {
        this.history += s + (noendl ? "" : this.endl);
    }

    run(cmd) {
        cmd = this.analyse(cmd);
        if (bin[cmd[0]]) {
            var f = bin[cmd[0]];
            return f(this, cmd);
        }
        return "(?)";
    }

    analyse(cmd) {
        cmd = cmd + "";
        var parts = [];
        var s = "";
        var p = '\"';
        for (var i = 0; i < cmd.length; i++) {
            var chr = cmd.charAt(i);
            switch (chr) {
                case '\\':
                    i += 1;
                    s += i < cmd.length ? cmd.charAt(i) : "";
                    break;
                case ' ':
                case '\t':
                    if (s != "") {
                        parts[parts.length] = s;
                        s = "";
                    }
                    break;
                case '\"':
                case '\'':
                    p = chr;
                    i += 1
                    while (i < cmd.length && cmd.charAt(i) != p) {
                        if (cmd.charAt(i) == '\\') {
                            var trs = cmd.charAt(i) + (i + 1 < cmd.length ? cmd.charAt(i + 1) : "");
                            trs = eval("\"" + trs + "\"");
                            i += 1;
                            s += trs;
                        } else {
                            s += cmd.charAt(i);
                        }
                        i++;
                    }
                    break;
                default:
                    s += chr;
            }
        }
        if (s != "") { parts[parts.length] = s; }
        return parts;
    }

    getString(s) {
        s = s || "";
        s = s.replace(/[ ]/g, this.space);
        s = s.replace(/[<]/g, this.scode[0]);
        s = s.replace(/[>]/g, this.scode[1]);

        s = s.replace(/\n/g, this.endl);
        return s;
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
        
        this.history += this.ps1 + this.editing + this.endl;
        var result = this.run(this.editing);
        if (result == true || !runable) {
            this.out(runable ? "(OK)" : "");
        } else {
            this.out(result);
        }

        this.editing = "";

        if (this.history.length > this.max_history) {
            this.history = this.history.substring(this.history.length - this.max_history, this.history.length);
        }
        if (this.history_cmd.length > this.max_history_cmd) {
            this.history_index -= 1;
            var nh = [];
            for (var i = 1; i < this.history_cmd.length; i++) {
                nh[i - 1] = this.history_cmd[i];
            }
            this.history_cmd = nh;
        }
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