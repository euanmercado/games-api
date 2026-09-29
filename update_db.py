import sqlite3

game_data = [
    {
        "title": "NBA 2K27",
        "image_url": "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSL2BskyLyullaJQUoYdfrCFvdju6LZyl75LZd8yq8X8Q&s=10",
        "description": "Next-generation basketball simulation featuring upgraded physics, realistic animations, updated franchise rosters, and expanded MyCAREER storyline modes."
    },
    {
        "title": "Dispatch",
        "image_url": "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQMshvukdBTl6KAuGgpNWvyJ9-EbmwjwDmyawmcwfH5HQ&s",
        "description": "An intense interactive narrative thriller centered on emergency dispatch operators managing critical high-stakes calls while uncovering an overarching citywide conspiracy."
    },
    {
        "title": "Minecraft",
        "image_url": "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSwTBxN53cACjAS2nJcMBvLC0XUFyIaNBMw8ShqIfnjAA&s=10",
        "description": "Explore infinitely generated blocky worlds, gather resources, craft tools, build grand structures, and survive against nocturnal creatures in this iconic sandbox adventure."
    },
    {
        "title": "Grand Theft Auto V",
        "image_url": "https://shared.cloudflare.steamstatic.com/store_item_assets/steam/apps/271590/header.jpg",
        "description": "When a young street hustler, a retired bank robber, and a terrifying psychopath find themselves entangled with the underworld, they must pull off dangerous heists to survive in Los Santos."
    },
    {
        "title": "Red Dead Redemption 2",
        "image_url": "https://shared.cloudflare.steamstatic.com/store_item_assets/steam/apps/1174180/header.jpg",
        "description": "An epic tale of outlaw Arthur Morgan and the infamous Van der Linde gang as they struggle to survive in America's unforgiving heartland at the dawn of the modern age."
    },
    {
        "title": "God of War Ragnarök",
        "image_url": "https://shared.cloudflare.steamstatic.com/store_item_assets/steam/apps/2322010/header.jpg",
        "description": "Kratos and Atreus embark on a mythic journey through each of the Nine Realms for answers and allies as Asgardian forces prepare for the prophesied battle."
    },
    {
        "title": "Tom Clancy's Rainbow Six Siege",
        "image_url": "https://shared.cloudflare.steamstatic.com/store_item_assets/steam/apps/359550/header.jpg",
        "description": "Master the art of destruction and gadgetry in intense tactical team-based combat, featuring high-lethality close-quarters engagements and strategic operator abilities."
    },
    {
        "title": "Life is Strange",
        "image_url": "https://shared.cloudflare.steamstatic.com/store_item_assets/steam/apps/319630/header.jpg",
        "description": "Follow Max Caulfield, a photography senior who discovers she can rewind time while saving her best friend Chloe Price in Arcadia Bay."
    },
    {
        "title": "Life is Strange 2",
        "image_url": "https://shared.cloudflare.steamstatic.com/store_item_assets/steam/apps/532210/header.jpg",
        "description": "After a tragic incident in Seattle, brothers Sean and Daniel Diaz flee home. Fearing the police, they head to Mexico while coping with Daniel's newly manifested telekinetic powers."
    },
    {
        "title": "Arc Raiders",
        "image_url": "https://shared.cloudflare.steamstatic.com/store_item_assets/steam/apps/1808500/header.jpg",
        "description": "A free-to-play third-person extraction shooter where players squad up to defend Earth against ruthless mechanized ARC forces invading from space."
    }
]

def update_catalog():
    conn = sqlite3.connect('games.db')
    cursor = conn.cursor()
    
    updated_count = 0
    for game in game_data:
        cursor.execute('''
            UPDATE games 
            SET image_url = ?, description = ? 
            WHERE LOWER(title) = LOWER(?)
        ''', (game['image_url'], game['description'], game['title']))
        updated_count += cursor.rowcount

    conn.commit()
    conn.close()
    print(f"✅ Successfully updated {updated_count} game records!")

if __name__ == '__main__':
    update_catalog()