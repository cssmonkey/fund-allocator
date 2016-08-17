var React = require('react'),
    ReactDOM = require('react-dom'),
    classNames = require('classnames'),
    helpers = require('./helpers'),
    data = require('./data');

var App = React.createClass({
    // set state
    getInitialState: function() {
        return {
            investmentValue: data.value,
            funds: data.funds,
            sumTotalOfFunds: 0,
            difference: 0,
            maxAllocationAssigned: false,
            maxAllocationMessage: "You have reached your max allocation"
        }
    },

    // update state with total sum of funds
    componentWillMount: function() {

        // get the total value of all the funds and set to state
        var sumTotal = this.getSumTotal(this.state.funds);
        this.state.sumTotalOfFunds = sumTotal

        // get the difference between total sum of funds and overal investment value
        this.state.difference = this.getDifference(sumTotal, this.state.investmentValue);

        // set state
        this.setState({
            sumTotalOfFunds: this.state.sumTotalOfFunds,
            difference: this.state.difference
        });
    },

    // spread the investment value equally amongst each of the funds
    autoAllocate: function(event) {
        var funds = this.state.funds,
            fundsLength = funds.length,
            investmentValue = this.state.investmentValue,
            allocationValue = investmentValue/fundsLength;

        funds.forEach((elem, i) => {
            this.state.funds[i].value = allocationValue;
        })
        this.state.sumTotalOfFunds = investmentValue;
        this.state.maxAllocationAssigned = true;
        this.state.difference = 0;

        this.setState({
            funds: this.state.funds,
            sumTotalOfFunds: this.state.sumTotalOfFunds,
            maxAllocationAssigned: this.state.maxAllocationAssigned,
            difference: this.state.difference
        });
    },

    // returns total value of all funds
    getSumTotal: (array) => {
        var total = 0;
        array.forEach(function(item) {
            total += item.value;
        });
        return total;
    },

    getDifference: function(allocation, total) {
        var difference = total - allocation;
        return difference;
    },

    // updates fund value to new value
    updateFund: function(index, newValue) {
        var sumTotalOfFunds,
            difference;

        this.state.funds[index].value = parseInt(newValue);
        sumTotalOfFunds = this.getSumTotal(this.state.funds);
        this.state.sumTotalOfFunds = sumTotalOfFunds;
        difference = this.getDifference(sumTotalOfFunds, this.state.investmentValue);
        this.state.difference = difference;

        // check if all the funds have been allocated
        if(sumTotalOfFunds == this.state.investmentValue) {
            this.state.maxAllocationAssigned = true;
        }

        this.setState({
            funds: this.state.funds,
            sumTotalOfFunds: this.state.sumTotalOfFunds,
            maxAllocationAssigned: this.state.maxAllocationAssigned
        });
    },

    // render a Fund panel
    renderFund: function(fund, index) {
        var maxValue = this.state.difference + fund.value;
        return (
            <Fund
                key={fund.id}
                fund={fund}
                maxValue={maxValue}
                total={this.state.investmentValue}
                index={index}
                updateFund={this.updateFund} />
        )
    },

    render: function() {

        var totalSumOfFunds = this.state.sumTotalOfFunds,
            investmentValue = this.state.investmentValue,
            difference = this.state.difference;
        var maxAllocationMsgClassName = classNames({
            'allocation-msg': true,
            'max-allocation-assigned': this.state.maxAllocationAssigned
        })
        return (
            <div className="fund-allocator-app">
                <Title text="Fund allocator demo" />
                <h2>Investment value = {helpers.formatPrice(investmentValue)}</h2>
                <h2>Total value of funds = {helpers.formatPrice(totalSumOfFunds)}</h2>
                <h3>Current allocation = {helpers.formatPercent((totalSumOfFunds/investmentValue))}</h3>
                <h4>Difference = {helpers.formatPercent((difference/investmentValue))}</h4>
                <div className="total-indicator">
                    <div className="total-indicator__inner" style={{width: helpers.formatPercent((totalSumOfFunds/investmentValue))}}></div>
                </div>
                <div className="fund-panels-container">
                    {this.state.funds.map(this.renderFund)}
                </div>
                <FundControls autoAllocate={this.autoAllocate} />
                <div className={maxAllocationMsgClassName}>
                    <span className="allocation-msg__text">{this.state.maxAllocationMessage}</span>
                </div>
            </div>
        )
    }
});

var Title = React.createClass({
    render: function() {
        return (
            <h1>{this.props.text}</h1>
        )
    }
})

var Fund = React.createClass({

    handleChange: function(event) {
        var index = this.props.index,
            newValue = event.target.value == "" ? 0 : Math.max(0, event.target.value);

        if(newValue >= this.props.maxValue) {
            newValue = this.props.maxValue;
        }

        this.props.updateFund(index, newValue);
    },

    render: function() {
        var fund = this.props.fund,
            fundValueInPercent = helpers.formatPercent((fund.value/this.props.total)),
            fundValueInPrice = helpers.formatPrice(fund.value),
            constaintValue = helpers.formatPercent((1 - (this.props.maxValue/this.props.total))),
            inputValue = helpers.formatNumber(fund.value, '0[.]00');
        return (
            <div className='fund-panel'>
                <h3>{fund.name} </h3>
                <input type="number" value={inputValue} onChange={this.handleChange} className="fund-panel__field" />
                <div className="fund-indicator">
                    <div className="fund-indicator__inner" style={{width: fundValueInPercent}}></div>
                    <div className="fund-indicator__constrain-marker" style={{width: constaintValue}}></div>
                </div>
                <p className="fund-panel__stats">Allocation: {fundValueInPercent} of {helpers.formatPrice(this.props.total)}
                    <br /> Current: {fundValueInPrice}
                    <br /> Max: {helpers.formatPrice(this.props.maxValue)}
                </p>
            </div>
        )
    }
});

var FundControls = React.createClass({

    autoAllocate: function() {
        this.props.autoAllocate();
    },

    render: function() {
        return(
            <ul className="fund-controls">
                <li><button type="button" title="Assign investment equally across all funds" onClick={this.autoAllocate}>Auto allocate</button></li>
            </ul>
        )
    }
})

ReactDOM.render(<App title="Fund allocator" />, document.getElementById('FundAllocatorApp'));
