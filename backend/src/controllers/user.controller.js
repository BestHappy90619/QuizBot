const Mailer = require("../utils/mailer");
const { CONTACT_MAIL_ADDRESS, MAILER_USER } = require("../utils/secrets");

exports.contact = async (req, res) => {
  const { fromName, fromEmail, subject, description } = req.body;
  const date = new Date();
  var time = date.toTimeString();
  var time = time.split(' ')[0].split(":");
  const contactNum = date.getTime();
  const data = {
    from: MAILER_USER,
    to: CONTACT_MAIL_ADDRESS || "info@articulateit.co.za",
    subject: "You have a new contact - #" + contactNum,
    html: `
    <!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Transitional//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd">
    <html
      xmlns="http://www.w3.org/1999/xhtml"
      xmlns:o="urn:schemas-microsoft-com:office:office"
    >
      <head>
        <meta charset="UTF-8" />
        <meta content="width=device-width, initial-scale=1" name="viewport" />
        <meta name="x-apple-disable-message-reformatting" />
        <meta http-equiv="X-UA-Compatible" content="IE=edge" />
        <meta content="telephone=no" name="format-detection" />
        <title>You have a new contact - #${contactNum}</title>
        <link
          href="https://fonts.googleapis.com/css2?family=Krona+One&display=swap"
          rel="stylesheet"
        />
        <link
          href="https://fonts.googleapis.com/css2?family=Poppins&display=swap"
          rel="stylesheet"
        />
        <style type="text/css">
          .rollover:hover .rollover-first {
            max-height: 0px !important;
            display: none !important;
          }
          .rollover:hover .rollover-second {
            max-height: none !important;
            display: inline-block !important;
          }
          .rollover div {
            font-size: 0px;
          }
          u ~ div img + div > div {
            display: none;
          }
          #outlook a {
            padding: 0;
          }
          span.MsoHyperlink,
          span.MsoHyperlinkFollowed {
            color: inherit;
            mso-style-priority: 99;
          }
          a.es-button {
            mso-style-priority: 100 !important;
            text-decoration: none !important;
          }
          a[x-apple-data-detectors] {
            color: inherit !important;
            text-decoration: none !important;
            font-size: inherit !important;
            font-family: inherit !important;
            font-weight: inherit !important;
            line-height: inherit !important;
          }
          .es-desk-hidden {
            display: none;
            float: left;
            overflow: hidden;
            width: 0;
            max-height: 0;
            line-height: 0;
            mso-hide: all;
          }
          .es-header-body a:hover {
            color: #f6c6ea !important;
          }
          .es-content-body a:hover {
            color: #666666 !important;
          }
          .es-footer-body a:hover {
            color: #f6c6ea !important;
          }
          .es-infoblock a:hover {
            color: #cccccc !important;
          }
          .es-button-border:hover > a.es-button {
            color: #ffffff !important;
          }
          @media only screen and (max-width: 600px) {
            h1 {
              font-size: 30px !important;
              text-align: center;
            }
            h2 {
              font-size: 24px !important;
              text-align: center;
            }
            h3 {
              font-size: 20px !important;
              text-align: left;
            }
            *[class="gmail-fix"] {
              display: none !important;
            }
            p,
            a {
              line-height: 150% !important;
            }
            h1,
            h1 a {
              line-height: 120% !important;
            }
            h2,
            h2 a {
              line-height: 120% !important;
            }
            h3,
            h3 a {
              line-height: 120% !important;
            }
            h4,
            h4 a {
              line-height: 120% !important;
            }
            h5,
            h5 a {
              line-height: 120% !important;
            }
            h6,
            h6 a {
              line-height: 120% !important;
            }
            h4 {
              font-size: 24px !important;
              text-align: left;
            }
            h5 {
              font-size: 20px !important;
              text-align: left;
            }
            h6 {
              font-size: 16px !important;
              text-align: left;
            }
            .es-header-body h1 a,
            .es-content-body h1 a,
            .es-footer-body h1 a {
              font-size: 30px !important;
            }
            .es-header-body h2 a,
            .es-content-body h2 a,
            .es-footer-body h2 a {
              font-size: 24px !important;
            }
            .es-header-body h3 a,
            .es-content-body h3 a,
            .es-footer-body h3 a {
              font-size: 20px !important;
            }
            .es-header-body h4 a,
            .es-content-body h4 a,
            .es-footer-body h4 a {
              font-size: 24px !important;
            }
            .es-header-body h5 a,
            .es-content-body h5 a,
            .es-footer-body h5 a {
              font-size: 20px !important;
            }
            .es-header-body h6 a,
            .es-content-body h6 a,
            .es-footer-body h6 a {
              font-size: 16px !important;
            }
            .es-menu td a {
              font-size: 14px !important;
            }
            .es-header-body p,
            .es-header-body a {
              font-size: 14px !important;
            }
            .es-content-body p,
            .es-content-body a {
              font-size: 14px !important;
            }
            .es-footer-body p,
            .es-footer-body a {
              font-size: 14px !important;
            }
            .es-infoblock p,
            .es-infoblock a {
              font-size: 12px !important;
            }
            .es-m-txt-c,
            .es-m-txt-c h1,
            .es-m-txt-c h2,
            .es-m-txt-c h3,
            .es-m-txt-c h4,
            .es-m-txt-c h5,
            .es-m-txt-c h6 {
              text-align: center !important;
            }
            .es-m-txt-r,
            .es-m-txt-r h1,
            .es-m-txt-r h2,
            .es-m-txt-r h3,
            .es-m-txt-r h4,
            .es-m-txt-r h5,
            .es-m-txt-r h6 {
              text-align: right !important;
            }
            .es-m-txt-j,
            .es-m-txt-j h1,
            .es-m-txt-j h2,
            .es-m-txt-j h3,
            .es-m-txt-j h4,
            .es-m-txt-j h5,
            .es-m-txt-j h6 {
              text-align: justify !important;
            }
            .es-m-txt-l,
            .es-m-txt-l h1,
            .es-m-txt-l h2,
            .es-m-txt-l h3,
            .es-m-txt-l h4,
            .es-m-txt-l h5,
            .es-m-txt-l h6 {
              text-align: left !important;
            }
            .es-m-txt-r img,
            .es-m-txt-c img,
            .es-m-txt-l img {
              display: inline !important;
            }
            .es-m-txt-r .rollover:hover .rollover-second,
            .es-m-txt-c .rollover:hover .rollover-second,
            .es-m-txt-l .rollover:hover .rollover-second {
              display: inline !important;
            }
            .es-m-txt-r .rollover div,
            .es-m-txt-c .rollover div,
            .es-m-txt-l .rollover div {
              line-height: 0 !important;
              font-size: 0 !important;
            }
            .es-spacer {
              display: inline-table;
            }
            a.es-button,
            button.es-button {
              font-size: 18px !important;
            }
            a.es-button,
            button.es-button {
              display: inline-block !important;
            }
            .es-button-border {
              display: inline-block !important;
            }
            .es-m-fw,
            .es-m-fw.es-fw,
            .es-m-fw .es-button {
              display: block !important;
            }
            .es-m-il,
            .es-m-il .es-button,
            .es-social,
            .es-social td,
            .es-menu {
              display: inline-block !important;
            }
            .es-adaptive table,
            .es-left,
            .es-right {
              width: 100% !important;
            }
            .es-content table,
            .es-header table,
            .es-footer table,
            .es-content,
            .es-footer,
            .es-header {
              width: 100% !important;
              max-width: 600px !important;
            }
            .adapt-img {
              width: 100% !important;
              height: auto !important;
            }
            .es-mobile-hidden,
            .es-hidden {
              display: none !important;
            }
            .es-desk-hidden {
              width: auto !important;
              overflow: visible !important;
              float: none !important;
              max-height: inherit !important;
              line-height: inherit !important;
              display: table-row !important;
            }
            tr.es-desk-hidden {
              display: table-row !important;
            }
            table.es-desk-hidden {
              display: table !important;
            }
            td.es-desk-menu-hidden {
              display: table-cell !important;
            }
            .es-menu td {
              width: 1% !important;
            }
            table.es-table-not-adapt,
            .esd-block-html table {
              width: auto !important;
            }
            .es-social td {
              padding-bottom: 10px;
            }
            .h-auto {
              height: auto !important;
            }
            .img-3749 {
              width: 50px !important;
            }
          }
        </style>
      </head>
      <body style="width: 100%; height: 100%; padding: 0; margin: 0">
        <div class="es-wrapper-color" style="background-color: #bfcf60">
          <table
            class="es-wrapper"
            width="100%"
            cellspacing="0"
            cellpadding="0"
            style="
              mso-table-lspace: 0pt;
              mso-table-rspace: 0pt;
              border-collapse: collapse;
              border-spacing: 0px;
              padding: 0;
              margin: 0;
              width: 100%;
              height: 100%;
              background-repeat: repeat;
              background-position: center top;
              background-color: #bfcf60;
            "
          >
            <tr>
              <td valign="top" style="padding: 0; margin: 0">
                <table
                  cellpadding="0"
                  cellspacing="0"
                  class="es-content"
                  align="center"
                  style="
                    mso-table-lspace: 0pt;
                    mso-table-rspace: 0pt;
                    border-collapse: collapse;
                    border-spacing: 0px;
                    width: 100%;
                    table-layout: fixed !important;
                  "
                >
                  <tr>
                    <td
                      align="center"
                      style="
                        padding: 0;
                        margin: 0;
                        background-size: initial;
                        background-attachment: initial;
                        background-origin: initial;
                        background-clip: initial;
                        background-color: #bfcf60;
                      "
                      bgcolor="#BFCF60"
                    >
                      <table
                        class="es-content-body"
                        align="center"
                        cellpadding="0"
                        cellspacing="0"
                        style="
                          mso-table-lspace: 0pt;
                          mso-table-rspace: 0pt;
                          border-collapse: collapse;
                          border-spacing: 0px;
                          background-color: transparent;
                          width: 600px;
                        "
                      >
                        <tr>
                          <td
                            align="left"
                            style="
                              padding: 0;
                              margin: 0;
                              padding-right: 20px;
                              padding-left: 20px;
                              padding-top: 20px;
                            "
                          >
                            <table
                              cellpadding="0"
                              cellspacing="0"
                              width="100%"
                              style="
                                mso-table-lspace: 0pt;
                                mso-table-rspace: 0pt;
                                border-collapse: collapse;
                                border-spacing: 0px;
                              "
                            >
                              <tr>
                                <td
                                  align="center"
                                  valign="top"
                                  style="padding: 0; margin: 0; width: 560px"
                                >
                                  <table
                                    cellpadding="0"
                                    cellspacing="0"
                                    width="100%"
                                    role="presentation"
                                    style="
                                      mso-table-lspace: 0pt;
                                      mso-table-rspace: 0pt;
                                      border-collapse: collapse;
                                      border-spacing: 0px;
                                    "
                                  >
                                    <tr>
                                      <td
                                        align="left"
                                        style="padding: 0; margin: 0"
                                      >
                                        <p
                                          style="
                                            margin: 0;
                                            mso-line-height-rule: exactly;
                                            font-family: Poppins, sans-serif;
                                            line-height: 21px;
                                            letter-spacing: 0;
                                            color: #666666;
                                            font-size: 14px;
                                          "
                                        >
                                          <br />
                                        </p>
                                      </td>
                                    </tr>
                                  </table>
                                </td>
                              </tr>
                            </table>
                          </td>
                        </tr>
                        <tr>
                          <td
                            align="left"
                            style="
                              margin: 0;
                              padding-top: 40px;
                              padding-right: 20px;
                              padding-bottom: 40px;
                              padding-left: 20px;
                              border-radius: 20px;
                              background-image: url(https://sycfhj.stripocdn.email/content/guids/CABINET_9b143e749e3aaed3697507da71b3bd7b7e0aa7b60b3fdc77ad722f0ebae80f8e/images/meshgradient_3.png);
                              background-repeat: no-repeat;
                              background-position: center center;
                              background-color: #5eb2f1;
                            "
                            background="https://sycfhj.stripocdn.email/content/guids/CABINET_9b143e749e3aaed3697507da71b3bd7b7e0aa7b60b3fdc77ad722f0ebae80f8e/images/meshgradient_3.png"
                            bgcolor="#5EB2F1"
                          >
                            <table
                              cellpadding="0"
                              cellspacing="0"
                              width="100%"
                              style="
                                mso-table-lspace: 0pt;
                                mso-table-rspace: 0pt;
                                border-collapse: collapse;
                                border-spacing: 0px;
                              "
                            >
                              <tr>
                                <td
                                  align="center"
                                  valign="top"
                                  style="padding: 0; margin: 0; width: 560px"
                                >
                                  <table
                                    cellpadding="0"
                                    cellspacing="0"
                                    width="100%"
                                    role="presentation"
                                    style="
                                      mso-table-lspace: 0pt;
                                      mso-table-rspace: 0pt;
                                      border-collapse: collapse;
                                      border-spacing: 0px;
                                    "
                                  >
                                    <tr>
                                      <td
                                        align="center"
                                        style="
                                          padding: 0;
                                          margin: 0;
                                          font-size: 0px;
                                        "
                                      >
                                        <img
                                          class="img-3749"
                                          src="https://sycfhj.stripocdn.email/content/guids/CABINET_7554b2cde563e7eb94452d6676fd1191bf7ae948a89c267ca55bf81db873eabb/images/logo_x16.png"
                                          alt
                                          style="
                                            display: block;
                                            font-size: 14px;
                                            border: 0;
                                            outline: none;
                                            text-decoration: none;
                                          "
                                          width="50"
                                        />
                                      </td>
                                    </tr>
                                    <tr>
                                      <td
                                        align="center"
                                        class="es-m-txt-c"
                                        style="
                                          padding: 0;
                                          margin: 0;
                                          padding-top: 10px;
                                          padding-bottom: 10px;
                                        "
                                      >
                                        <h1
                                          style="
                                            margin: 0;
                                            font-family: 'Krona One', sans-serif;
                                            mso-line-height-rule: exactly;
                                            letter-spacing: 0;
                                            font-size: 40px;
                                            font-style: normal;
                                            font-weight: bold;
                                            line-height: 48px;
                                            color: #2e0249;
                                          "
                                        >
                                          You have a new contact!
                                        </h1>
                                      </td>
                                    </tr>
                                    <tr>
                                      <td
                                        align="center"
                                        class="es-m-txt-c"
                                        style="
                                          padding: 0;
                                          margin: 0;
                                          padding-top: 10px;
                                          padding-bottom: 30px;
                                        "
                                      >
                                        <h2
                                          style="
                                            margin: 0;
                                            font-family: 'Krona One', sans-serif;
                                            mso-line-height-rule: exactly;
                                            letter-spacing: 0;
                                            font-size: 24px;
                                            font-style: normal;
                                            font-weight: bold;
                                            line-height: 29px;
                                            color: #2e0249;
                                          "
                                        >
                                          from&nbsp;${fromName}
                                        </h2>
                                      </td>
                                    </tr>
                                  </table>
                                </td>
                              </tr>
                              <tr>
                                <td
                                  align="center"
                                  valign="top"
                                  style="
                                    padding: 0;
                                    margin: 0;
                                    border-radius: 20px;
                                    overflow: hidden;
                                    width: 560px;
                                  "
                                >
                                  <table
                                    cellpadding="0"
                                    cellspacing="0"
                                    width="100%"
                                    style="
                                      mso-table-lspace: 0pt;
                                      mso-table-rspace: 0pt;
                                      border-collapse: separate;
                                      border-spacing: 0px;
                                      border-radius: 20px;
                                      border-top: 1px solid #efefef;
                                      border-right: 1px solid #dddcdc;
                                      border-bottom: 1px solid #dddcdc;
                                      border-left: 1px solid #efefef;
                                      background-color: #ffffff;
                                    "
                                    bgcolor="#ffffff"
                                    role="presentation"
                                  >
                                    <tr>
                                      <td
                                        align="left"
                                        style="
                                          padding: 0;
                                          margin: 0;
                                          padding-right: 20px;
                                          padding-left: 20px;
                                          padding-top: 20px;
                                        "
                                      >
                                        <p
                                          style="
                                            margin: 0;
                                            mso-line-height-rule: exactly;
                                            font-family: Poppins, sans-serif;
                                            line-height: 21px;
                                            letter-spacing: 0;
                                            color: #666666;
                                            font-size: 14px;
                                          "
                                        >
                                          <strong>${subject}</strong>
                                        </p>
                                      </td>
                                    </tr>
                                    <tr>
                                      <td
                                        align="left"
                                        style="
                                          padding: 0;
                                          margin: 0;
                                          padding-right: 20px;
                                          padding-left: 20px;
                                          padding-top: 10px;
                                        "
                                      >
                                        <p
                                          style="
                                            margin: 0;
                                            mso-line-height-rule: exactly;
                                            font-family: 'courier new', courier,
                                              'lucida sans typewriter',
                                              'lucida typewriter', monospace;
                                            line-height: 21px;
                                            letter-spacing: 0;
                                            color: #666666;
                                            font-size: 14px;
                                          "
                                        >
                                          ${description}
                                        </p>
                                      </td>
                                    </tr>
                                    <tr>
                                      <td
                                        align="right"
                                        style="
                                          padding: 0;
                                          margin: 0;
                                          padding-right: 20px;
                                          padding-left: 20px;
                                          padding-bottom: 15px;
                                        "
                                      >
                                        <p
                                          style="
                                            margin: 0;
                                            mso-line-height-rule: exactly;
                                            font-family: Poppins, sans-serif;
                                            line-height: 17px;
                                            letter-spacing: 0;
                                            color: #666666;
                                            font-size: 14px;
                                          "
                                        >
                                          <strong>at ${time[0]}:${time[1]}</strong>
                                        </p>
                                      </td>
                                    </tr>
                                  </table>
                                </td>
                              </tr>
                              <tr>
                                <td
                                  align="center"
                                  valign="top"
                                  style="padding: 0; margin: 0; width: 560px"
                                >
                                  <table
                                    cellpadding="0"
                                    cellspacing="0"
                                    width="100%"
                                    role="presentation"
                                    style="
                                      mso-table-lspace: 0pt;
                                      mso-table-rspace: 0pt;
                                      border-collapse: collapse;
                                      border-spacing: 0px;
                                    "
                                  >
                                    <tr>
                                      <td
                                        align="center"
                                        class="es-m-txt-c"
                                        style="
                                          padding: 0;
                                          margin: 0;
                                          padding-top: 20px;
                                          padding-bottom: 5px;
                                        "
                                      >
                                        <h3
                                          style="
                                            margin: 0;
                                            font-family: 'comic sans ms',
                                              'marker felt-thin', arial, sans-serif;
                                            mso-line-height-rule: exactly;
                                            letter-spacing: 0;
                                            font-size: 16px;
                                            font-style: normal;
                                            font-weight: bold;
                                            line-height: 19px;
                                            color: #2e0249;
                                          "
                                        >
                                          ${fromName}
                                        </h3>
                                      </td>
                                    </tr>
                                    <tr>
                                      <td
                                        align="center"
                                        class="es-m-txt-c"
                                        style="
                                          padding: 0;
                                          margin: 0;
                                          padding-top: 5px;
                                        "
                                      >
                                        <h3
                                          style="
                                            margin: 0;
                                            font-family: 'comic sans ms',
                                              'marker felt-thin', arial, sans-serif;
                                            mso-line-height-rule: exactly;
                                            letter-spacing: 0;
                                            font-size: 16px;
                                            font-style: normal;
                                            font-weight: bold;
                                            line-height: 19px;
                                            color: #2e0249;
                                          "
                                        >
                                          ${fromEmail}
                                        </h3>
                                      </td>
                                    </tr>
                                  </table>
                                </td>
                              </tr>
                            </table>
                          </td>
                        </tr>
                      </table>
                    </td>
                  </tr>
                </table>
                <table
                  cellpadding="0"
                  cellspacing="0"
                  class="es-footer"
                  align="center"
                  style="
                    mso-table-lspace: 0pt;
                    mso-table-rspace: 0pt;
                    border-collapse: collapse;
                    border-spacing: 0px;
                    width: 100%;
                    table-layout: fixed !important;
                    background-color: transparent;
                    background-repeat: repeat;
                    background-position: center top;
                  "
                >
                  <tr>
                    <td
                      align="center"
                      bgcolor="#BFCF60"
                      style="padding: 0; margin: 0; background-color: #bfcf60"
                    >
                      <table
                        class="es-footer-body"
                        align="center"
                        cellpadding="0"
                        cellspacing="0"
                        bgcolor="#BFCF60"
                        style="
                          mso-table-lspace: 0pt;
                          mso-table-rspace: 0pt;
                          border-collapse: collapse;
                          border-spacing: 0px;
                          background-color: #bfcf60;
                          border-radius: 0px 0px 10px 10px;
                          width: 600px;
                        "
                      >
                        <tr>
                          <td
                            align="left"
                            style="
                              margin: 0;
                              padding-right: 20px;
                              padding-left: 20px;
                              padding-bottom: 30px;
                              padding-top: 30px;
                            "
                          >
                            <table
                              cellpadding="0"
                              cellspacing="0"
                              width="100%"
                              style="
                                mso-table-lspace: 0pt;
                                mso-table-rspace: 0pt;
                                border-collapse: collapse;
                                border-spacing: 0px;
                              "
                            >
                              <tr>
                                <td
                                  align="left"
                                  style="padding: 0; margin: 0; width: 560px"
                                >
                                  <table
                                    cellpadding="0"
                                    cellspacing="0"
                                    width="100%"
                                    role="presentation"
                                    style="
                                      mso-table-lspace: 0pt;
                                      mso-table-rspace: 0pt;
                                      border-collapse: collapse;
                                      border-spacing: 0px;
                                    "
                                  >
                                    <tr>
                                      <td
                                        align="center"
                                        style="
                                          padding: 0;
                                          margin: 0;
                                          padding-top: 10px;
                                          padding-bottom: 10px;
                                        "
                                      >
                                        <p
                                          style="
                                            margin: 0;
                                            mso-line-height-rule: exactly;
                                            font-family: Poppins, sans-serif;
                                            line-height: 18px;
                                            letter-spacing: 0;
                                            color: #2e0249;
                                            font-size: 12px;
                                          "
                                        >
                                          You are receiving this email because your
                                          email has been set the contact address of
                                          our site. Make sure our messages get to
                                          your Inbox (and not your bulk or junk
                                          folders).
                                        </p>
                                        <p
                                          style="
                                            margin: 0;
                                            mso-line-height-rule: exactly;
                                            font-family: Poppins, sans-serif;
                                            line-height: 18px;
                                            letter-spacing: 0;
                                            color: #2e0249;
                                            font-size: 12px;
                                          "
                                        >
                                          ${date.toLocaleString("default", { year: "numeric" })}-${date.toLocaleString("default", { month: "2-digit" })}-${date.toLocaleString("default", { day: "2-digit" })}
                                        </p>
                                      </td>
                                    </tr>
                                  </table>
                                </td>
                              </tr>
                            </table>
                          </td>
                        </tr>
                      </table>
                    </td>
                  </tr>
                </table>
              </td>
            </tr>
          </table>
        </div>
      </body>
    </html>
    
    `,
  };

  const result = await Mailer.send(data);
  res.send(result);
};
