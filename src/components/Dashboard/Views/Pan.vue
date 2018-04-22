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
          <card>
            <h5 class="card-title">当前路径&nbsp;&nbsp;{{position}}</h5>
            <br>
            <button type="submit" class="btn btn-info float-left" @click="goBack">
              Go Back
            </button>
            <button type="submit" class="btn btn-info btn-fill float-left" @click="goBack">
              Upload
            </button>
            <div class="all-icons">
              <div class="row">
                <div v-for="file of files" :key="file.type" class="font-icon-list col-lg-2 col-md-3 col-sm-4 col-6">
                  <div class="font-icon-detail icon-frame" @click="itemClick(file)">
                    <i class="nc-icon iconClass" :class="iconClass(file)"></i>
                    <p class="file-name">{{file.name}}</p>
                  </div>
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
        }
      }
    },
    computed: {
      
    },
    methods: {
      freshItems() {
        this.$http.get('http://172.18.159.146/getlist?path=' + this.position).then(response => {
          this.files = response.body;
          // alert(JSON.stringify(response.body));
        }, response => {
          // alert(3);
          alert('Eden的树莓派炸了，请重试');
          alert(response.body);
        })
      },
      itemClick(file) {
        if(file.type == 'dir') {
          this.position += (this.position == '/' ? '' : '/') + file.name 
          this.freshItems();
        }
        else {
          location.href = 'http://172.18.159.146/RJpan/' + this.position + file.name
        }
      },
      goBack() {
        this.position = this.position.slice(0, this.position.lastIndexOf("/"))
        if (this.position == '')  {
          this.position = '/'
        }
        this.freshItems();
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
    border: 1px solid red;
    padding-bottom: 0px !important;
    min-height: 150px;
  }
  .file-name{
    padding-left: 10px;
    padding-right: 10px;
  }
  .btn{
    margin-right: 30px;
  }
</style>
