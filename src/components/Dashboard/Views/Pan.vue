<template>
  <div class="content">
    <div class="container-fluid">
      <div class="row">
        <b-modal id="modalPrevent"
                ref="modal"
                title="确定要删除吗？"
                @ok="handleDelete">
        </b-modal>
        <div class="col-md-12">
          <card>
            <template slot="header">
              <h4 class="card-title">中大网盘</h4>
              <p class="card-category">Hardware supplied by our friend <a href="cuijiawei.cn">Eden</a></p>
            </template>
          </card>

          <!-- 上传文件 -->
          <card>
            <h5 class="card-title">上传文件</h5>
            <br>
            <b-form @submit.prevent="submitFile" action="http://172.18.159.146/upload" method="POST" enctype="multipart/form-data">
              <b-form-file v-model="file" name="file"  @change="changeImage($event)" :state="Boolean(file)" placeholder="Choose a file..."></b-form-file>
              <b-form-input name="dir_path" :value="position" v-show="false" ></b-form-input>
              <b-form-input name="op" value="upload" v-show="false" ></b-form-input>
              <button type="submit" class="btn btn-primary btn-sm float-left btn-upload">
                Upload
              </button>
            </b-form>
          </card>

          <!-- 浏览/下载/删除 文件 -->
          <card>
            <h5 class="card-title">当前路径&nbsp;&nbsp;Home{{position}}</h5>
            <br>
            <button type="submit" class="btn btn-primary" @click="goBack">
              Go Back
            </button>
            <br>
            <div class="all-icons">
              <div class="row">
                <div v-for="(file, index) in files" :key="file.name" class="font-icon-list col-lg-2 col-md-3 col-sm-4 col-6">
                  <transition name="item-hover">
                    <div class="font-icon-detail icon-frame" @click="itemClick(index)" @mouseenter="itemHover(index)" @mouseleave="itemLeave(index)">
                      <p v-b-modal.modalPrevent v-if="files[index].hover" class="deleteIcon" @click.stop="deleteFileSetIndex(index)">X</p>
                      <i class="nc-icon iconClass" :class="iconClass(index)"></i>
                      <p class="file-name">{{file.name}}</p>
                    </div>
                  </transition>
                </div>
              </div>
            </div>
          </card>

        </div>
      </div>
    </div>
  </div>
</template>
<script>
  import Card from 'src/components/UIComponents/Cards/Card.vue'
  export default {
    components: {
      Card
    },
    data() {
      return {
        files: [],
        file: false,
        uploadFileName: '',
        uploadFile: '',
        delIndex: '',
        position: '/',
        iconClass(index) {
          return {
            "nc-backpack": this.files[index].type == 'dir',
            "nc-paper-2": this.files[index].type == 'file'
          }
        },
        // show: true,
        itemHoverClass: ''
      }
    },
    computed: {
      
    },
    methods: {

      // 模块加载
      freshItems() {
        this.$http.get('http://172.18.159.146/getlist?path=' + this.position)
        .then(response => {
          this.files = response.body.map((item, index) => {
            item.hover = false;
            return item;
          });
        }, response => {
          // alert(3);
          alert('Eden的树莓派炸了，请重试');
          alert(JSON.stringify(response));
        })
      },


      // 点击文件/文件夹
      itemClick(index) {
        if(this.files[index].type == 'dir') {
          this.position += (this.position == '/' ? '' : '/') + this.files[index].name 
          this.freshItems();
        }
        else {
          location.href = 'http://172.18.159.146/RJpan' + this.position + (this.position == '/' ? '' : '/') + this.files[index].name
        }
      },

      //处理用户上传图片
      changeImage(e) {
        var file = e.target.files[0]
        this.uploadFile = e.target.files[0]
      },
      //发送文件
      submitFile() {
        let formData = new FormData();
        formData.append('op', 'upload');
        formData.append('dir_path', this.position);
        formData.append('file', this.uploadFile);
        this.$http.post("http://172.18.159.146/upload",formData,{
          headers: {
            'Content-Type': 'multipart/form-data'
          }
        }).then(response => {
          this.freshItems();
        },response => {
          alert(JSON.stringify(response));
        });
      },

      //后退操作
      goBack() {
        this.position = this.position.slice(0, this.position.lastIndexOf("/"))
        if (this.position == '')  {
          this.position = '/'
        }
        this.freshItems();
      },

      deleteFile() {
        // alert(this.position + (this.position == '/' ? '' : '/') + file.name);
        const params = {
          'op': 'delfile',
          'file_path': this.position + (this.position == '/' ? '' : '/') + this.files[this.delIndex].name
        }
        this.$http.get('http://172.18.159.146/op',{
          params: params
        }).then(response => {
          // alert('终于删除成功，累死Eden的树莓派了');
          this.freshItems();
        },response => {
          console.log(JSON.stringify(response));
        });
      },
      deleteFileSetIndex(index) {
        this.delIndex = index;
      },

      handleDelete() {
        this.deleteFile();
      },

      //鼠标覆盖
      itemHover(index) {
        this.files[index].hover = true;
      },
      itemLeave(index) {
        this.files[index].hover = false;
      }




    },
    mounted() {
      this.freshItems();
    }
  }
</script>
<style>
  .icon-position{
    /* border: 1px solid red; */
    /* width: 100px !important; */
    margin-top: -50px;
  }
  .icon-frame{
    position: relative;
    border: 1px solid red;
    padding-bottom: 0px !important;
    min-height: 150px;
    cursor: pointer;
  }
  .icon-frame:hover{
    transform:translateY(-5px);
    -ms-transform:translateY(-5px); 	/* IE 9 */
    -moz-transform:translateY(-5px); 	/* Firefox */
    -webkit-transform:translateY(-5px); /* Safari 和 Chrome */
    -o-transform:translateY(-5px); 	/* Opera */
    transition:all 1s;
    -moz-transition:all 1s; /* Firefox 4 */
    -webkit-transition:all 1s; /* Safari and Chrome */
    -o-transition:all 1s; /* Opera */
  }
  .file-name{
    padding-left: 10px;
    padding-right: 10px;
  }
  .btn{
    margin-right: 30px;
  }
  .btn-upload{
    margin-top: 20px;
  }

  .deleteIcon {
    position: absolute;
    right: 10px;
    top: 10px;
    border: 1px solid #aaaaaa;
    color: #555555;
    /* background-color: #555555; */
    border-radius: 3px;
    width: 30px;
    height: 25px;
    text-align: center;
    display: flex;
    justify-content: center;
  }
  .deleteIcon:hover {
    color: white;
    border-color: red;
    background-color: red;
    transition:all .5s;
    -moz-transition:all .5s; /* Firefox 4 */
    -webkit-transition:all .5s; /* Safari and Chrome */
    -o-transition:all .5s; /* Opera */
  }

  .fade-enter-active, .fade-leave-active {
    transition: opacity .5s;
  }
  .fade-enter, .fade-leave-to /* .fade-leave-active below version 2.1.8 */ {
    opacity: 0;
  }

</style>
