export default function SeachBar({value, onChange}) {
    return (
        <section className="search-section container">
            <label htmlFor="busca">Buscar vagas</label>
            <input 
            type="search" 
            id="busca"
            placeholder="Ex: React, Node, Remoto..."
            value={value}
            onChange={onChange}
             />
        </section>
    );
}

