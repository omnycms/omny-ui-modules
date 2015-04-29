define(["react", "jquery","utilities/ModuleManager","utilities/OmnyApiRequester"],
    function(React, $, moduleManager, apiRequester) {
        var DevModuleAdder = React.createClass({
            componentDidMount: function() {
                var node = this.getDOMNode();
            },
            handleSave: function(event) {
                var data = this.serializeForm($(this.getDOMNode()));
                var updateFunction = function() {
                        var url = data.url;
                        if(url.endsWith(".jsx")) {
                            url = url.substring(0,url.lastIndexOf(".jsx"));
                        }
                        apiRequester.apiRequest("pages","modules",{
                           data: JSON.stringify({
                            	"pageName": data.path,
                                "pageModules" : {
                                    "main": [
                                    {
                                        "data": {
                                           
                                        },
                                        "omnyClass": "TestModule",
                                        "url": url
                                    }
                                ]
                                }
                            }),
                            contentType: "application/json; charset=utf-8",
                            dataType: "json",
                            type: "PUT",
                            success: function() {
                                console.log("good to go");
                            }
                       })
                   };
                apiRequester.apiRequest("pages","", {
                   data: JSON.stringify({
                    	"name": data.path,
                    	"fromSample": {
                    		"sampleName":"Default",
                    		"theme":"Html5Up-Striped"
                    	},
                      "pageDetails": {
                        "title": data.name
                      }
                    }),
                    contentType: "application/json; charset=utf-8",
                    dataType: "json",
                    type: "POST",                   
                    success: updateFunction,
                    error: updateFunction
                })
                
            },
            serializeForm: function(form) {
                var config = {};
                $(form).serializeArray().map(function(item) {
                    if ( config[item.name] ) {
                        if ( typeof(config[item.name]) === "string" ) {
                            config[item.name] = [config[item.name]];
                        }
                        config[item.name].push(item.value);
                    } else {
                        config[item.name] = item.value;
                    }
                });
                return config;
            },
            render: function() {
                return <form>
                    <h1>Create or update dev page</h1>
                    <div>
                        <label>Page Name</label>
                        <input type="text" name="name" />
                    </div>
                    <div>
                        <label>Path</label>
                        <input type="text" name="path" />
                    </div>
                    <div>
                        <label>Url to module</label>
                        <input type="text" name="url" />
                    </div>
                    <div>
                        <input type="button" value="Save" onClick={this.handleSave} />
                    </div>
                </form>;
            }
        });
        
        var DevModuleLister = React.createClass({
            getInitialState: function() {
                return {modules: []};
            },
            componentDidMount: function() {
                var node = this.getDOMNode();
                var lister = this;
                apiRequester.apiRequest("extensibility","ui/devmodules",{
                    success: function(modules) {
                        lister.setState({modules: modules});
                    }
                });
            },
            render: function() {
                return <ul>
                 {this.state.modules.map(function(module, i){
                      return <li key={i}>
                       {decodeURIComponent(module.name)}
                        </li>;
                  })}
              </ul>;;
            }
        });
        
        var DevModuleManager = React.createClass({
            componentDidMount: function() {
                var url = this.props.url;
                moduleManager.setSaveFunction(this.getDOMNode(),function() {
                    return {"omnyClass":"DevModuleManager","data":{}};
                }, url);
            },
          render: function() {
            return <div>
            <DevModuleAdder />
            <DevModuleLister />
            </div>;
          }
        });
        function DevModManager(data, editable, url) {
            this.render = function(element) {
                React.render(<DevModuleManager url={url} />, element)
            }
        }
        return DevModManager;
    }
);