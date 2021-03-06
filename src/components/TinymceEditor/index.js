import React, { PureComponent, Fragment } from 'react';
import isAbsoluteUrl from 'is-absolute-url';
// import { isEmpty } from 'lodash';
import { Editor } from '@tinymce/tinymce-react';
// import loadScript from 'load-script';
import request from 'utils/request';
import { HZERO_FILE } from 'utils/config';
import notification from 'utils/notification';
import { getCurrentLanguage } from 'utils/utils';

// Import TinyMCE
import 'tinymce/tinymce';

// A theme is also required
import 'tinymce/themes/modern/theme';

// Any plugins you want to use has to be imported
import 'tinymce/plugins/paste';
import 'tinymce/plugins/link';
import 'tinymce/plugins/table';
import 'tinymce/plugins/image';
import 'tinymce/plugins/imagetools';
import 'tinymce/plugins/preview';
import 'tinymce/plugins/code';
import 'tinymce/plugins/codesample';
import 'tinymce/plugins/textcolor';
import 'tinymce/plugins/fullscreen';
import 'tinymce/plugins/lists';
import 'tinymce/plugins/template';
// import 'tinymce/plugins/pagebreak';
import 'tinymce/plugins/searchreplace';
// import 'tinymce/plugins/toc';
// import 'tinymce/plugins/anchor';
import 'tinymce/plugins/print';
// import 'tinymce/skins/lightgray/skin.min.css';
import './content.min.css';
import RichTextInsertFile from './RichTextInsertFile';

export default class TinymceEditor extends PureComponent {
  state = {
    uploadFileModalvisible: false,
  };

  componentDidMount() {
    // const language = getCurrentLanguage();
    // if (language !== 'en_US' && isEmpty(window.tinymce.i18n.data[language])) {
    //   import(`./locale/${language}.js`);
    // }
  }

  imagesUploadHandler(blobInfo, success, failure) {
    const { bucketName = 'static-text' } = this.props;
    const formData = new FormData();
    formData.append('file', blobInfo.blob(), 'blob.png');
    request(`${HZERO_FILE}/v1/files/multipart`, {
      method: 'POST',
      query: { bucketName, fileName: 'blob.png' },
      body: formData,
      responseType: 'text',
    }).then(res => {
      if (isAbsoluteUrl(res)) {
        success(res);
        notification.success();
      } else {
        failure(JSON.parse(res).message);
        notification.error({ message: JSON.parse(res).message });
      }
    });
  }

  handleOnChange(event) {
    const { onChange = e => e } = this.props;
    onChange(event.target.getContent());
  }

  editorSetup(editor) {
    editor.addButton('insertFile', {
      icon: 'upload',
      tooltip: 'Insert File',
      onclick: this.setUploadFileModalvisible.bind(this),
    });
  }

  setUploadFileModalvisible() {
    const { uploadFileModalvisible } = this.state;
    this.setState({
      uploadFileModalvisible: !uploadFileModalvisible,
    });
  }

  uploadFileModalOk(content) {
    this.tinymceEditor.editor.insertContent(content);
  }

  render() {
    const { content, bucketName = 'static-text' } = this.props;
    const { uploadFileModalvisible } = this.state;
    const language = getCurrentLanguage();
    const languageConfig =
      language !== 'en_US'
        ? {
            language,
            language_url: `/tinymce/langs/${language}.js`,
          }
        : {};
    const richTextInsertFileProps = {
      bucketName,
      visible: uploadFileModalvisible,
      onOk: this.uploadFileModalOk.bind(this),
      onCancel: this.setUploadFileModalvisible.bind(this),
    };
    return (
      <Fragment>
        <Editor
          ref={ref => {
            this.tinymceEditor = ref;
          }}
          value={content}
          init={{
            target: this.editor,
            plugins: [
              'paste',
              'link',
              'table',
              'image',
              'imagetools',
              'preview',
              'code',
              'codesample',
              'textcolor',
              'fullscreen',
              'lists',
              'template',
              // 'pagebreak',
              'searchreplace',
              // 'toc',
              // 'anchor',
              'print',
            ],
            toolbar:
              'undo redo | formatselect fontselect | alignleft aligncenter alignright alignjustify | bold italic strikethrough forecolor backcolor | link image insertFile | numlist bullist outdent indent  | removeformat fullscreen',
            images_upload_handler: this.imagesUploadHandler.bind(this),
            min_height: 500,
            setup: this.editorSetup.bind(this),
            ...languageConfig,
          }}
          onChange={this.handleOnChange.bind(this)}
        />
        <RichTextInsertFile {...richTextInsertFileProps} />
      </Fragment>
    );
  }
}
