export type Level = {
    trainCount: number,
    map: string[]
}

export const Levels: Level[] = [
    {
        trainCount: 20,
        map: [
            "+>|>}>}>#>",
            "  #<]v|v  ",
            "      #v  ",
        ],
    },
    {
        trainCount: 20,
        map: [
            "  ]^}>#>  ",
            "  |^#v#^  ",
            "]^{>|>{>#>",
            "}^]>  #^  ",
            "|^{v|>{>#>",
            "|^|v#^    ",
            "+^[v{>#>  ",
        ],
    },
];