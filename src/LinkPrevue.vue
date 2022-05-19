<template>
  <div>
    <div id="loader-container" v-if="!response && validUrl" :style="{width:cardWidth}">
      <slot name="loading">
        <div class="spinner"></div>
      </slot>
    </div>
    <div v-if="response">
      <slot
        :img="response.image"
        :title="response.title"
        :description="response.description"
        :url="url"
      >
        <div class="wrapper" :style="{width:cardWidth}">
          <div class="card-img">
            <img :src="response.image" />
          </div>
          <div class="card-info">
            <div class="card-text">
              <h1>{{response.title}}</h1>
              <p>{{response.description}}</p>
            </div>
            <div class="card-btn">
              <a href="javascript:;" v-if="showButton" @click="viewMore">View More</a>
            </div>
          </div>
        </div>
      </slot>
    </div>
  </div>
</template>

<script>
import fetch from 'cross-fetch';

export default {
  name: "link-prevue",
  props: {
    url: {
      type: String,
      default: "",
    },
    cardWidth: {
      type: String,
      default: "400px",
    },
    onButtonClick: {
      type: Function,
      default: undefined,
    },
    showButton: {
      type: Boolean,
      default: true,
    },
    apiUrl: {
      type: String,
      default: "https://link-prevue-api-v2.herokuapp.com/preview/",
    },
  },
  watch: {
    url: function () {
      this.response = null;
      this.getLinkPreview();
    },
  },
  created() {
    this.getLinkPreview();
  },
  data: function () {
    return {
      response: null,
      validUrl: false,
    };
  },
  methods: {
    viewMore: function () {
      if (this.onButtonClick !== undefined) {
        this.onButtonClick(this.response);
      } else if(typeof window !== 'undefined') {
        const win = window.open(this.url, "_blank");
        win.focus();
      }
    },
    isValidUrl: function (url) {
      const regex = /https?:\/\/(www\.)?[-a-zA-Z0-9@:%._+~#=]{2,256}\.[a-z]{2,6}\b([-a-zA-Z0-9@:%_+.~#?&//=]*)/;
      this.validUrl = regex.test(url);
      return this.validUrl;
    },
    getLinkPreview: function () {
      if (this.isValidUrl(this.url)) {
        this.httpRequest(
          (response) => {
            this.response = response;
          },
          (error) => {
            console.log(error);
            this.response = null;
            this.validUrl = false;
          }
        );
      }
    },
    httpRequest: function (success, error) {
      let params = {
        url: this.url,
      };

      let body = [];
      for (let property in params) {
        let encodedKey = encodeURIComponent(property);
        let encodedValue = encodeURIComponent(params[property]);
        body.push(encodedKey + "=" + encodedValue);
      }
      body = body.join("&");

      fetch(this.apiUrl,
          {
            method: 'POST',
            mode: 'cors',
            cache: 'no-cache',
            credentials: 'same-origin',
            headers: {
              'Content-Type': 'application/x-www-form-urlencoded'
            },
            redirect: 'follow',
            body: body
          }
      )
          .then(res => {
            if (res.status >= 400) {
              throw new Error("Bad response from server");
            }
            return res.json();
          })
          .then(result => {
            success(result);
          })
          .catch(err => {
            error(err);
          });
    },
  },
};
</script>