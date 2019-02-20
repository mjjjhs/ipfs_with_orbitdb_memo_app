<template>
  <div class="addGetFile">
    <h1>{{ msg }}</h1>
    <p>
      Image File을 분산 파일시스템(P2P Protocol)에 업로드하여 분산 파일시스템에서 Image Data를 받는다.
    </p>
    <h4>업로드</h4>
    <!-- Styled -->

    <form id="uploadFile" action="/api/ipfs/addFile" method="post" enctype="multipart/form-data">
      <b-form-file
        v-model="file"
        :state="Boolean(file)"
        placeholder="Choose a file..."
        drop-placeholder="Drop file here..."
        accept="image/jpeg, image/png, image/gif, image/jpg"
        name="imagesFile"
        id="uploadInput"
      />
    </form>
    <div>
      <b-button variant="outline-primary" v-if="file && !isLoading" v-on:click="clickUpload">Upload</b-button>
      <div class="d-flex justify-content-center mb-3" v-if="isLoading">
        <b-spinner label="Loading..." />
      </div>
    </div>
    <b-modal id="modal1" hide-footer title="알림" @hidden="onHidden">
      <p>업로드 하려는 파일의 타입에 오류가 있습니다.</p>
      <p>PNG, JPEG, JPG, GIF 이미지파일만 업로드 가능합니다</p>
      <hr />
      <p class="mb-0">
        이미지 파일을 다시 업로드 부탁드립니다.
      </p>
      <b-button class="mt-3" variant="outline-danger" block @click="hideModal('modal1')">확인</b-button>
    </b-modal>
    <b-modal id="modal2" hide-footer title="알림" @hidden="onHidden">
      <p>분산파일시스템에 파일업로드가 실패했습니다.</p>
      <hr />
      <p class="mb-0">
        해당 문제가 계속 발생하면 담당자에게 연락바랍니다.
      </p>
      <b-button class="mt-3" variant="outline-danger" block @click="hideModal('modal2')">확인</b-button>
    </b-modal>
    <h4 v-if="imgData && !file">분산 파일시스템 업로드 이미지</h4>
    <p v-if="imgData && !file">{{imgData.hash}}</p>
    <img class="resultImg" :src="imgData.src" v-if="imgData && !file">
  </div>
</template>

<script>
import axios from 'axios';

export default {
  name: 'AddGetFile',
  props: {
    msg: String,
  },
  data() {
    return {
      file: null,
      isLoading: false,
      imgData: null
    }
  },
  methods: {
    async clickUpload(e) {
      const formData = new FormData(document.getElementById('uploadFile'));
      const headers = {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      };
      try {
        this.isLoading = true;
        const rv = await axios.post(
          '/api/ipfs/addFile',
          formData,
          headers
        );
        this.isLoading = false;
        console.log('rv::', rv.data);
        if(rv.data.result !== 200){
          switch(rv.data.message) {
            case 'FILE_TYPE_ERROR':
              this.showModal('modal1');
              break;
            case 'IPFS_ADD_ERROR':
              this.showModal('modal2');
              break;
          }
        }else {
          this.file = null;
          this.imgData = {
            src: `data:image/png;base64, ${rv.data.data.src}`,
            hash: rv.data.data.hash
          }
        }
      } catch (e) {
        console.log('err::', e );
      }
    },
    showModal (modalType) {
      console.log('show modalType::',modalType);
      this.$root.$emit('bv::show::modal', modalType);
    },
    hideModal (modalType) {
      console.log('hide modalType::',modalType);
      this.$root.$emit('bv::hide::modal', modalType);
    },
    onHidden (evt) {
      // Return focus to our Open Modal button
      // See accessibility below for additional return-focus methods
      document.getElementById('uploadInput').focus();
      this.file = null;
    }
  }
};
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
  h4 {
    margin: 40px 0 0;
  }
  h1 {
    margin-top: 20px;
  }
  ul {
    list-style-type: none;
    padding: 0;
  }
  li {
    display: inline-block;
    margin: 0 10px;
  }
  a {
    color: #42b983;
  }
  .custom-file {
    min-width:310px;
    width:70%;
    margin-top: 20px;
  }
  .btn, .d-flex {
    margin-top: 20px;
  }
  .resultImg {
    margin-top:20px;
    width:70%;
    min-width:310px;
  }
</style>
