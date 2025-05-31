import { CartesianGrid, Legend, Line, LineChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts';

interface Props {
    data: FormattedData[];
    keys: string[];
    type: "sent" | "received";
};

const SOCIAL_MEDIA_COLORS = {
    whatsapp: '#25D366',
    facebook: '#1877F2',
    instagram: '#E4405F',
    twitter: '#1DA1F2',  
    linkedin: '#0A66C2',
    youtube: '#FF0000', 
    pinterest: '#E60023',
    snapchat: '#FFFC00',
    tiktok: '#000000',  
    telegram: '#229ED9',
    reddit: '#FF4500',  
    discord: '#5865F2', 
    spotify: '#1DB954',
    twitch: '#9146FF',
};  

export default function Chart({ data, keys, type }: Props) {
    return (
        <ResponsiveContainer width="100%" height={300}>
            <LineChart 
                data={data}
                margin={{ top: 20, right: 30, left: 0, bottom: 0 }}
            >
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="date" />
            <YAxis />
            <Tooltip />
            <Legend />
            {keys.map((key) => {
                const colors = {
                    [key]: "#000000",
                    ...SOCIAL_MEDIA_COLORS,
                } as {
                    [k in string]: string;
                };

                return (
                    <Line 
                        key={key} 
                        type="monotone" 
                        name={key} 
                        dataKey={type + "." + key} 
                        stroke={colors[key]}
                    />
                );
            })}
            </LineChart>
        </ResponsiveContainer>
    );
};