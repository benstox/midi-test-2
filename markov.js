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
    var initials = _.map(
        _.values(data),
        function(melody) {return(melody.substring(0, order));
    });

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

var generate_markov = function(data, order, min_length) {
    min_length = min_length || 15;
    var processed = load_data(data, order);
    var s = randChoice(processed.initials);
    while (s.length < min_length || !(_.some(processed.finals, function(final) {return(_.endsWith(s, final));}))) {
        s = s + randChoice(processed.chains[s.substring(s.length - order)]);
    };
    return(s);
};
