import React, { useState, useEffect, useRef } from "react";
import closeButton from "public/icons/xmark.svg";
import collapse from "public/icons/collapse.svg";
import helpCd from "public/image/help/help-cd.png";
import helpOpen from "public/image/help/help-open.png";
import helpNew from "public/image/help/help-new.png";
import helpRemove from "public/image/help/help-rm.png";
import helpSave from "public/image/help/help-save.png";
import helpSettings from "public/image/help/help-settings.png";
import "public/css/help.css";

const HelpScreen = ({ parser }) => {
  const [displaySection, setDisplaySection] = useState(null);

  const toggleSection = (section) => {
    setDisplaySection((prev) => (prev === section ? null : section));
  };

  return (
    <div className="help-container">
      <img
        src={closeButton}
        className="close-button"
        onClick={() => parser.closeHelp()}
      />
      <div className="help-group">
        <div className="title" onClick={() => toggleSection("command-line")}>
          <div className="setting-title">Using Command Line</div>

          <img
            src={collapse}
            className={`collapse-icon ${
              displaySection === "command-line" ? "rotated" : ""
            }`}
          />
        </div>

        <div
          className="theme collapse"
          style={{
            display: displaySection === "command-line" ? "block" : "none",
          }}
        >
          <div className="help-description">
            <p>
              Use the command line to perform various actions within the editor.
              You can quickly execute commands, navigate, and control the editor
              with the defined instructions directly from this interface
            </p>
          </div>
          <div className="help-item">
            <div className="help-item-label">Go to a folder</div>

            <div className="help-item-description">
              <img className="help-img" src={helpCd} />
              <p className="description-text">
                You can navigate to a folder using the cd command, supporting
                both relative and full paths. To move up one directory level,
                simply use cd..
              </p>
            </div>
          </div>
          <div className="help-item-separator"></div>

          <div className="help-item">
            <div className="help-item-label">Open a file</div>

            <div className="help-item-description">
              <img className="help-img" src={helpOpen} />
              <p className="description-text">
                Use the "open" command followed by the file path to open a file
                in the editor window.
              </p>
            </div>
          </div>
          <div className="help-item-separator"></div>

          <div className="help-item">
            <div className="help-item-label">Create a new file</div>

            <div className="help-item-description">
              <img className="help-img" src={helpNew} />
              <p className="description-text">
                Use the "new" command followed by the file name to create a new
                file in the current folder. File will be automatically opened in
                the editor window.
              </p>
            </div>
          </div>
          <div className="help-item-separator"></div>

          <div className="help-item">
            <div className="help-item-label">Delete a file</div>

            <div className="help-item-description">
              <img className="help-img" src={helpRemove} />
              <p className="description-text">
                Use the "rm" command followed by the file name to delete file in
                the current folder.
              </p>
            </div>
          </div>
          <div className="help-item-separator"></div>
          <div className="help-item">
            <div className="help-item-label">Save a file</div>

            <div className="help-item-description">
              <img className="help-img" src={helpSave} />
              <p className="description-text">
                Use the "save" command save the active file in the current
                folder. If you wish to save file with a different name, type the
                new file name following to "save" command.
              </p>
            </div>
          </div>
          <div className="help-item-separator"></div>
          <div className="help-item">
            <div className="help-item-label">Close file</div>

            <div className="help-item-description">
              <img className="help-img" src={helpCd} />
              <p className="description-text">
                Use the "close" command to close the active tab. A prompt will
                be displayed to inform you if any changes found in the active
                tab before save.
              </p>
            </div>
          </div>
          <div className="help-item-separator"></div>
          <div className="help-item">
            <div className="help-item-label">Open Settings</div>

            <div className="help-item-description">
              <img className="help-img" src={helpSettings} />
              <p className="description-text">
                Use the "settings" command to display the settings window
              </p>
            </div>
          </div>
          <div className="help-item-separator"></div>
        </div>
      </div>
    </div>
  );
};

export default HelpScreen;
