import ServerInfo from '../models/ServerInfo';

class Util {

    /**
     * Formats and converts a dateTime using the given zoneId.
     * If no zoneId is given, then uses the client system's configured zoneId.
     * @param dateTime
     * @param zoneId
     * @param appendTZ whether to append the timezone to the formatted string
     * @returns {string}
     */
    static dateTimeFormatter(dateTime, appendTZ, zoneId) {
        zoneId = zoneId || this.clientTimezone();
        const options = {
            year: 'numeric', month: '2-digit', day: '2-digit',
            hour: '2-digit', minute: '2-digit',
            timeZone: zoneId ? zoneId : this.clientTimezone(),
        };

        const formatter = new Intl.DateTimeFormat('de-CH', options);
        const startingDate = new Date(dateTime);

        const formattedDate = formatter.format(startingDate);
        if (appendTZ) {
            return formattedDate + ' ' + zoneId;
        }
        return formattedDate;
    }

    static clientTimezone() {
        return Intl.DateTimeFormat().resolvedOptions().timeZone;
    }

    static serverInfo() {
        return new ServerInfo(JSON.parse(localStorage.getItem('serverInfo')));
    }

    static isClientAndServerTZEquals() {
        return this.clientTimezone() === this.serverInfo().zoneId;
    }

    /**
     * Converts a dateTime to server local time
     * @param dateTime
     * @param appendTZ whether to append the timezone to the formatted string
     * @returns {string}
     */
    static dateTimeInServerLocalTime(dateTime, appendTZ) {
        const zoneId = Util.serverInfo().zoneId;
        return this.dateTimeFormatter(dateTime, appendTZ, zoneId);
    }

    static timeFormatter(date, zoneId) {
        const options = {
            year: 'numeric', month: '2-digit', day: '2-digit',
            hour: '2-digit', minute: '2-digit',
            timeZone: zoneId,
        };
        const formatter = new Intl.DateTimeFormat('de-CH', options);
        const startingDate = new Date(date);

        return formatter.format(startingDate) + ' ' + zoneId;
    }

    static fetchServerInfo() {
        fetch('/api/info').then(response => {
            if (response.ok) {
                return response.json();
            } else {
                throw new Error(response.statusText);
            }
        }).then(body => {
            console.debug('Server information', body);
            const serverInfo = new ServerInfo(body);
            localStorage.setItem('serverInfo', serverInfo.toString());
        }).catch(error => {
            console.error('Failed to get response from server', error);
        });
    }

    static humanize(str) {
        return str
            .replace(/^[\s_]+|[\s_]+$/g, '')
            .replace(/[_\s]+/g, ' ')
            .replace(/([a-z])([A-Z])/, function(m) {
                return m[0] + ' ' + m[1];
            })
            .replace(/^[a-z]/, function(m) {
                return m.toUpperCase();
            });
    }

    static getIsDarkFromLocalStorage() {
        let isDark = localStorage.getItem('isDarkMode') || false;
        if (!!isDark) {
            isDark = isDark === 'true';
        } else {
            localStorage.setItem('isDarkMode', isDark + '');
        }
        return isDark;
    };

    static toggleAndThenGetIsDark() {
        const isDark = Util.getIsDarkFromLocalStorage();
        localStorage.setItem('isDarkMode', !isDark + '');
        return !isDark;
    };

    static MEDIA_TYPE_MAP = {
        // Code
        'py': 'code',
        'js': 'code',
        'css': 'code',
        'json': 'code',
        'md': 'code',
        'c': 'code',
        'cpp': 'code',
        'h': 'code',
        'java': 'code',
        'txt': 'code',
        'csv': 'code',
        'tsv': 'code',
        'html': 'code',
        'sh': 'code',

        // Image
        'png': 'img',
        'jpg': 'img',
        'jpeg': 'img',
        'gif': 'img',
        'svg': 'img',
    };

    static EXTENSION_LANGUAGE_MAP = {
        'py': 'python',
        'js': 'javascript',
        'css': 'css',
        'json': 'json',
        'md': 'markdown',
        'c': 'c',
        'cpp': 'cpp',
        'h': 'cpp',
        'java': 'java',
        'txt': 'text',
        'csv': 'text',
        'tsv': 'text',
        'html': 'html',
        'sh': 'shell',
    };
}

export default Util;