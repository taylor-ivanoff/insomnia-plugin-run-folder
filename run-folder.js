module.exports.requestGroupActions = [
  {
    label: 'Send All Requests',
    action: async (context, data) => {
      console.log(context)
      const { requests } = data;

      let results = [];

      results.push(`<tr>
                      <th>Request</th>
                      <th>Status Code</th>
                      <th>Time</th>
                      <th>Bytes</th>
                    </tr>`);

      for (const request of requests) {
        const response = await context.network.sendRequest(request);

        var color = getStatusCodeColor(response.statusCode);
        var time = millisecToHumanReadable(response.elapsedTime);

        results.push(`<tr>
                        <td id="td_left">[${request.method}] ${request.name}</td>
                        <td id="td_left"><font color="${color}">${response.statusCode} ${response.statusMessage}</font></td>
                        <td id="td_right">${time}</td>
                        <td id="td_right">${response.bytesRead}</td>
                      </tr>`);
      }

      const css = `table { margin: 0 auto 0 auto; width: 100%; padding: 15px; }
                   th, .label--small, label > small { text-align: left; padding: 15px !important; padding-bottom: none !important; font-size: 15px !important; }
                   td { padding: 10px 10px 10px 15px; }
                   #td_left { text-align: left; padding: 10px; }
                   #td_right { text-align: center; padding: 10px; }`;
                   
      const html = `<html>
                      <head>
                        <style>${css}</style>
                      </head>
                      <body>
                        <table>${results.join('\n')}</table>
                      </body>
                    </html>`;

      context.app.showGenericModalDialog('Results', { html });
    },
  },
];

function getStatusCodeColor(statusCode) {
  if (statusCode.toString().startsWith("2")) {
    return "#8AB46C";
  } else if (statusCode.toString().startsWith("4")) {
    return "#D19A66";
  } else if (statusCode.toString().startsWith("5")) {
    return "#D8696F";
  }
}

function millisecToHumanReadable(millisec) {
  var seconds = (millisec / 1000).toFixed(2);

  if (millisec < 1000) {
    return millisec.toFixed(0) + " ms";
  } else if (seconds < 60) {
    return seconds + " s";
  }
}
