// OLD PYTHON VERSION
// def load_strings(s, order):
//     table = {}
//     for i in range(len(s) - order):
//         try:
//             table[s[i:i + order]]
//         except KeyError:
//             table[s[i:i + order]] = []
//         table[s[i:i + order]] += s[i + order]
//     return table

// def generate(order, strings_to_load, start = None, max_length = 20):
//     table = load_strings(strings_to_load, order)
//     if start == None:
//         s = random.choice(table.keys())
//     else:
//         s = start
//     try:
//         while len(s) < max_length:
//             s += random.choice(table[s[-order:]])
//     except KeyError:
//         pass
//     return s

var load_data = function(data, order) {
    // Process all the data provided for Markov chaining.
    // Yields initials, full chains and finals.
    var initials = _.reduce(
        _.values(data),
        function(acc, value) {
            var key = value.substring(0, order);
            if (acc[key]) {
                acc[key].push(value[order]);
            } else {
                acc[key] = [value[order]];
            };
            return(acc);
        },
        {}
    );

    var chains = _.reduce(
        _.map(_.values(data), function(melody) {
            return(
                _.reduce(
                    _.split(melody, ""),
                    function(acc, value, index, coll) {
                        if (index < coll.length - order) {
                            var key = _.join(coll.slice(0 + index, order + index), "");
                            if (acc[key]) {
                                acc[key].push(coll[order + index]);
                            } else {
                                acc[key] = [coll[order + index]];
                            };
                        };
                        return(acc);
                    },
                    {}
                )
            );
        }),
        function(acc, value) {
            _.forEach(value, function(next_values, key, coll) {
                if (acc[key]) {
                    acc[key].concat(next_values);
                } else {
                    acc[key] = next_values;
                };
            });
            return(acc);
        }
    );

    var finals = _.uniq(
        _.map(
            _.values(data),
            function(melody) {return(melody.substring(melody.length - order));}
        )
    );

    return({
        initials: initials,
        chains: chains,
        finals: finals,
    });
};
