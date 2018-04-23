<template>
  <div class="content">
    <div class="container-fluid">
      <div class="row">
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
            <b-form action="http://172.18.159.146/upload" method="POST" enctype="multipart/form-data">
              <b-form-file v-model="file" name="file" :state="Boolean(file)" placeholder="Choose a file..."></b-form-file>
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
            <button type="submit" class="btn btn-primary float-left" @click="goBack">
              Go Back
            </button>
            

            <div class="all-icons">
              <div class="row">
                <div v-for="file of files" :key="file.type" class="font-icon-list col-lg-2 col-md-3 col-sm-4 col-6">
                  <transition name="item-hover">
                    <div class="font-icon-detail icon-frame" @click="itemClick(file)" @mouseenter="itemHover(file)" @mouseleave="itemLeave(file)">
                      <p v-if="file.hover" class="deleteIcon">X</p>
                      <i class="nc-icon iconClass" :class="iconClass(file)"></i>
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
        position: '/',
        iconClass(file) {
          return {
            "nc-backpack": file.type == 'dir',
            "nc-paper-2": file.type == 'file'
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
        this.$http.get('http://172.18.159.146/getlist?path=' + this.position).then(response => {
          this.files = response.body.map((item, index) => {
            item.hover = false;
            return item;
          });
          console.log(this.files);
          // alert(JSON.stringify(response.body));
        }, response => {
          // alert(3);
          alert('Eden的树莓派炸了，请重试');
          alert(response.body);
        })
      },

      // 点击文件/文件夹
      itemClick(file) {
        if(file.type == 'dir') {
          this.position += (this.position == '/' ? '' : '/') + file.name 
          this.freshItems();
        }
        else {
          location.href = 'http://172.18.159.146/RJpan/' + this.position + file.name
        }
      },


      //后退操作
      goBack() {
        this.position = this.position.slice(0, this.position.lastIndexOf("/"))
        if (this.position == '')  {
          this.position = '/'
        }
        this.freshItems();
      },


      //鼠标覆盖
      itemHover(file) {
        file.hover = true;
        console.log("hover");
      },
      itemLeave(file) {
        file.hover = false;
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
    color: #888888;
    border-radius: 3px;
    width: 30px;
    height: 25px;
    text-align: center;
    display: flex;
    justify-content: center;
  }
  .deleteIcon:hover {
    color: white;
    border-color: black;
    background-color: black;
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
