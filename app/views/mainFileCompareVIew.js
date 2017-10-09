define([
    'underscore',
    'backbone',
    '../templates/mainFileCompareTemplate.html',
    './fileCompareView.js',
    '../lib/fileMatch.js',
    '../lib/bootstrap.css'
], function (_, Backbone, MainTemplate, FileCompareView) {

return Backbone.View.extend({
    className: "bs-callout bs-callout-primary flexBlock flexWrap mainViews",
    template: _.template(MainTemplate),

    events: {
        "click #report": "unmachedReport"
    },
    
    initialize: function() {
        this.data = {
            "file1": {},
            "file2": {}
        };
        Backbone.on("triggerCompareView", this.triggerCompare, this);
    },

    render: function() {
        this.$el.html(this.template({}));
        this.setModels();
        return this;
    },

    setModels: function() {
        this.model1 = this.model;
        this.model2 = this.model;

        this.fileCompareView1 = new FileCompareView({model: this.model1});
        this.fileCompareView2 = new FileCompareView({model: this.model2});
    },
    
    triggerCompare: function(fileObj, matchingOn) {
        this.matchingOn = matchingOn;

        this.commonData1 = [];
        this.commonData2 = [];

        this.differentData1 = [];
        this.differentData2 = [];

        var fileData1 = fileObj.fileUploadView1.data;
        var fileData2 = fileObj.fileUploadView2.data;

        var matchingCount1 = this.matchingRecords(fileData1, fileData2);
        var matchingCount2 = this.matchingRecords(fileData1, fileData2);

        // perfect match data
        commonData1 = _.filter(matchingCount1, function(val, index) {
            return val[(val.length-1)/2] == 1;
        });

        commonData2 = _.filter(matchingCount2, function(val, index) {
            return val[(val.length-1)/2] == 1;
        });

        // completley different data
        differentData1 = _.filter(matchingCount1, function(val, index) {
            return val[(val.length-1)/2] !== 1;
        });

        differentData2 = _.filter(matchingCount2, function(val, index) {
            return val[(val.length-1)/2] !== 1;
        });

        this.model1.set({
            'name': fileObj.fileUploadView1.file.name,
            'totalDataCount': fileObj.fileUploadView1.data.length,
            'commonDataCount': commonData1.length,
            'unmachedDataCount': differentData1.length
        });
        this.$("#loadCompareViews").append(this.fileCompareView1.render().$el);

        this.model2.set({
            'name': fileObj.fileUploadView2.file.name,
            'totalDataCount': fileObj.fileUploadView2.data.length,
            'commonDataCount': commonData2.length,
            'unmachedDataCount': differentData2.length
        });
        this.$("#loadCompareViews").append(this.fileCompareView2.render().$el);
    },

    matchingRecords: function(fileData1, fileData2) {
        var fileMatch = new FileMatch(fileData1, fileData2);
    },

    unmachedReport: function() {
        Backbone.trigger("triggerUnmatched", this.data, this.matchingOn);
    }

  });

});