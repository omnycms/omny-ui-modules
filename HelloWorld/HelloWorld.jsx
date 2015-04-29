define(["react","utilities/ModuleManager"],
    function(React, moduleManager) {
        var HelloWorld = React.createClass({
            componentDidMount: function() {
                var url = this.props.url;
                moduleManager.setSaveFunction(this.getDOMNode(),function() {
                    return {"omnyClass":"HelloWorld","data":{}};
                }, url);
            },
          render: function() {
            return <div>Hello World!</div>;
          }
        });
        function Hello(data, editable, url) {
            this.render = function(element) {
                React.render(<HelloWorld url={url} />, element)
            }
        }
        return Hello;
    }
);